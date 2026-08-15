import z from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const gamificationRouter = createTRPCRouter({
  /** Get current user's XP, wallet balance, and level */
  getMyStats: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;
    const xp = (user as any).xp_points ?? 0;
    const coins = (user as any).wallet_balance ?? 0;
    const level = Math.floor(xp / 200) + 1;
    const xpForNextLevel = level * 200;
    const xpProgress = xp - (level - 1) * 200;

    return {
      xp,
      coins,
      level,
      xpForNextLevel,
      xpProgress,
      xpProgressPercent: Math.min(100, Math.round((xpProgress / 200) * 100)),
    };
  }),

  /** Get leaderboard (top 20 users by XP) */
  getLeaderboard: protectedProcedure.query(async ({ ctx }) => {
    const users = await ctx.db.find({
      collection: "users",
      sort: "-xp_points",
      limit: 20,
      depth: 1,
    });

    return users.docs.map((u: any, idx: number) => ({
      id: String(u.id),
      name: u.fullName || u.username || "Anonymous",
      xpPoints: u.xp_points ?? 0,
      campusName: typeof u.campus === "object" && u.campus ? u.campus.name : "Kampus",
      rank: idx + 1,
    }));
  }),

  /** Get all badges earned by the current user */
  getMyBadges: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;

    const earned = await ctx.db.find({
      collection: "user_badges",
      where: { user: { equals: user.id } },
      depth: 2,
      limit: 100,
    });

    const allBadges = await ctx.db.find({
      collection: "badges",
      limit: 100,
    });

    return allBadges.docs.map((badge: any) => {
      const userBadge = earned.docs.find((ub: any) => {
        const badgeId = typeof ub.badge === "object" ? ub.badge.id : ub.badge;
        return badgeId === badge.id;
      });

      return {
        id: String(badge.id),
        name: badge.name,
        description: badge.description,
        iconUrl: badge.iconUrl,
        category: badge.category,
        xpBonus: badge.xpBonus,
        isEarned: !!userBadge,
        earnedAt: userBadge ? (userBadge as any).earnedAt : null,
      };
    });
  }),

  /** Get quests with user progress (simplified — progress tracked via DB counts) */
  getMyQuests: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;

    const quests = await ctx.db.find({
      collection: "quests",
      limit: 20,
    });

    // For each quest, calculate progress based on actionType
    const questsWithProgress = await Promise.all(
      quests.docs.map(async (quest: any) => {
        let progress = 0;

        switch (quest.actionType) {
          case "order_food": {
            const orders = await ctx.db.find({
              collection: "orders",
              where: {
                and: [
                  { customer: { equals: user.id } },
                  { status: { equals: "COMPLETED" } },
                ],
              },
            });
            progress = orders.totalDocs;
            break;
          }
          case "attend_event": {
            const regs = await ctx.db.find({
              collection: "event-registrations",
              where: { user: { equals: user.id } },
            });
            progress = regs.totalDocs;
            break;
          }
          case "report_lost_found": {
            const items = await ctx.db.find({
              collection: "lost-found-items",
              where: { reportedBy: { equals: user.id } },
            });
            progress = items.totalDocs;
            break;
          }
          case "mentor_session": {
            const sessions = await ctx.db.find({
              collection: "mentorship_sessions",
              where: {
                and: [
                  {
                    or: [
                      { mentor: { equals: user.id } },
                      { mentee: { equals: user.id } },
                    ],
                  },
                  { status: { equals: "completed" } },
                ],
              },
            });
            progress = sessions.totalDocs;
            break;
          }
          default:
            progress = 0;
        }

        const isCompleted = progress >= (quest.targetCount ?? 1);

        return {
          id: String(quest.id),
          title: quest.title,
          description: quest.description,
          xpReward: quest.xpReward,
          type: quest.type as "daily" | "weekly" | "milestone",
          progress: Math.min(progress, quest.targetCount ?? 1),
          targetCount: quest.targetCount ?? 1,
          isCompleted,
        };
      })
    );

    return questsWithProgress;
  }),

  /** Get wallet transaction history */
  getWalletHistory: protectedProcedure.query(async ({ ctx }) => {
    // For now, we derive history from completed orders + mentorship sessions
    const user = ctx.session.user;

    const orders = await ctx.db.find({
      collection: "orders",
      where: {
        and: [
          { customer: { equals: user.id } },
          { status: { equals: "COMPLETED" } },
        ],
      },
      sort: "-createdAt",
      limit: 10,
    });

    const mentorSessions = await ctx.db.find({
      collection: "mentorship_sessions",
      where: {
        and: [
          {
            or: [
              { mentor: { equals: user.id } },
              { mentee: { equals: user.id } },
            ],
          },
          { status: { equals: "completed" } },
        ],
      },
      sort: "-createdAt",
      limit: 10,
    });

    const history: Array<{
      id: string;
      type: "earned" | "spent";
      amount: number;
      description: string;
      date: string;
    }> = [];

    orders.docs.forEach((order: any) => {
      history.push({
        id: `order-${order.id}`,
        type: "earned",
        amount: 5,
        description: `Reward: Pesanan kantin selesai`,
        date: order.createdAt,
      });
    });

    mentorSessions.docs.forEach((session: any) => {
      const isMentor =
        (typeof session.mentor === "object" ? session.mentor.id : session.mentor) === user.id;
      history.push({
        id: `mentor-${session.id}`,
        type: isMentor ? "earned" : "spent",
        amount: session.priceCoins ?? 0,
        description: isMentor
          ? `Pendapatan: Sesi mentoring "${session.topic}"`
          : `Pembayaran: Sesi mentoring "${session.topic}"`,
        date: session.createdAt,
      });
    });

    // Sort by date descending
    history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return history;
  }),

  /** Redeem coins for canteen discount */
  redeemCoinsForDiscount: protectedProcedure
    .input(z.object({ amount: z.number().min(10) }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;
      const currentBalance = (user as any).wallet_balance ?? 0;

      if (currentBalance < input.amount) {
        throw new Error("Saldo koin tidak mencukupi");
      }

      await ctx.db.update({
        collection: "users",
        id: user.id,
        data: {
          wallet_balance: currentBalance - input.amount,
        },
      });

      return {
        success: true,
        discountRupiah: input.amount * 100, // 1 koin = Rp 100
        remainingBalance: currentBalance - input.amount,
      };
    }),

  /** Get all Gigs (Micro-Projects) */
  getGigs: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;

    const gigs = await ctx.db.find({
      collection: "gigs",
      limit: 50,
      sort: "-createdAt",
      depth: 1, // To get poster details
    });

    return gigs.docs.map((g: any) => {
      const poster = typeof g.poster === "object" ? g.poster : null;
      const worker = typeof g.worker === "object" ? g.worker : null;

      let isOwner = poster?.id === user.id;
      let isWorker = worker?.id === user.id;

      return {
        id: String(g.id),
        title: g.title,
        description: g.description,
        category: g.category,
        budgetCoins: g.budgetCoins,
        deadline: g.deadline,
        status: g.status, // OPEN, TAKEN, COMPLETED
        submissionUrl: g.submissionUrl,
        posterName: poster?.fullName || poster?.username || "Seseorang",
        posterCampus: poster?.campus?.name || "Kampus",
        isOwner,
        isWorker,
      };
    });
  }),

  /** Post a new Gig */
  postGig: protectedProcedure
    .input(z.object({
      title: z.string().min(5),
      description: z.string().min(10),
      category: z.string(),
      budgetCoins: z.number().min(10),
      deadline: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;
      const currentBalance = (user as any).wallet_balance ?? 0;

      // Check if user has enough coins to pay for the gig
      if (currentBalance < input.budgetCoins) {
        throw new Error("Saldo Nexora Coins tidak mencukupi untuk membuat Gig ini.");
      }

      // Deduct coins from poster immediately (escrow)
      await ctx.db.update({
        collection: "users",
        id: user.id,
        data: {
          wallet_balance: currentBalance - input.budgetCoins,
        },
      });

      return await ctx.db.create({
        collection: "gigs",
        data: {
          title: input.title,
          description: input.description,
          category: input.category,
          budgetCoins: input.budgetCoins,
          deadline: input.deadline,
          status: "OPEN",
          poster: user.id as any,
        }
      });
    }),

  /** Take a Gig (Accept the job) */
  takeGig: protectedProcedure
    .input(z.object({ gigId: z.coerce.number() }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;

      const gig: any = await ctx.db.findByID({
        collection: "gigs",
        id: input.gigId,
      });

      if (!gig) throw new Error("Gig tidak ditemukan.");
      if (gig.status !== "OPEN") throw new Error("Gig sudah diambil orang lain atau sudah selesai.");
      if (typeof gig.poster === "object" ? gig.poster.id === user.id : gig.poster === user.id) {
        throw new Error("Anda tidak bisa mengambil Gig yang Anda buat sendiri.");
      }

      return await ctx.db.update({
        collection: "gigs",
        id: input.gigId,
        data: {
          status: "TAKEN",
          worker: user.id as any,
        }
      });
    }),

  /** Submit/Complete a Gig (Worker submits link, gets paid) */
  completeGig: protectedProcedure
    .input(z.object({ gigId: z.coerce.number(), submissionUrl: z.string().url() }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;

      const gig: any = await ctx.db.findByID({
        collection: "gigs",
        id: input.gigId,
      });

      if (!gig) throw new Error("Gig tidak ditemukan.");
      if (gig.status !== "TAKEN") throw new Error("Gig belum diambil atau sudah selesai.");
      
      const workerId = typeof gig.worker === "object" ? gig.worker.id : gig.worker;
      if (workerId !== user.id) {
        throw new Error("Hanya pekerja yang bisa mengumpulkan hasil Gig ini.");
      }

      // Pay the worker
      const currentWorkerBalance = (user as any).wallet_balance ?? 0;
      const currentWorkerXp = (user as any).xp_points ?? 0;
      
      await ctx.db.update({
        collection: "users",
        id: user.id,
        data: {
          wallet_balance: currentWorkerBalance + gig.budgetCoins,
          xp_points: currentWorkerXp + 50, // bonus XP for completing a gig
        },
      });

      return await ctx.db.update({
        collection: "gigs",
        id: input.gigId,
        data: {
          status: "COMPLETED",
          submissionUrl: input.submissionUrl,
        }
      });
    }),
});
