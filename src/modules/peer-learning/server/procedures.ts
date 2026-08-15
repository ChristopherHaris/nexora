import z from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const peerLearningRouter = createTRPCRouter({
  /** Find available tutors (students registered in Tutors collection) */
  findTutors: protectedProcedure
    .input(z.object({ search: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const currentUser = ctx.session.user;

      const whereClause: any = {
        and: [
          { user: { not_equals: currentUser.id } },
          { status: { equals: "APPROVED" } }, // Only show approved tutors
        ],
      };

      const tutorsData = await ctx.db.find({
        collection: "tutors",
        where: whereClause,
        limit: 20,
        depth: 2,
      });

      // Count completed sessions for each tutor based on user ID
      const tutors = await Promise.all(
        tutorsData.docs.map(async (tutor: any) => {
          const tutorUser = typeof tutor.user === 'object' ? tutor.user : null;
          if (!tutorUser) return null;

          const sessions = await ctx.db.find({
            collection: "mentorship_sessions",
            where: {
              and: [
                { mentor: { equals: tutorUser.id } },
                { status: { equals: "completed" } },
              ],
            },
          });

          return {
            id: String(tutorUser.id), // Mentorship uses user ID, not tutor ID
            tutorId: String(tutor.id),
            name: tutorUser.fullName || tutorUser.username || "Anonymous",
            title: tutor.title || "Tutor",
            major: tutorUser.major || "Umum",
            rating: tutor.rating ?? 5.0,
            completedSessions: tutor.totalSessions || sessions.totalDocs,
            hourlyRateCoins: tutor.coinRatePerHour ?? 50,
            skills: tutor.skills?.map((s: any) => s.skill) || ["Umum"],
            bio: tutor.bio || "Tutor berpengalaman di bidangnya.",
            cvUrl: tutor.cvUrl,
            portfolioUrl: tutor.portfolioUrl,
          };
        })
      );

      return tutors.filter(Boolean);
    }),

  /** Register current user as a Tutor */
  registerTutor: protectedProcedure
    .input(z.object({
      title: z.string().min(3),
      skills: z.array(z.string()),
      coinRatePerHour: z.number().min(0),
      bio: z.string(),
      cvUrl: z.string().url(),
      portfolioUrl: z.string().url().optional().or(z.literal("")),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;

      const tutor = await ctx.db.create({
        collection: "tutors",
        data: {
          user: user.id as any,
          title: input.title,
          skills: input.skills.map(s => ({ skill: s })),
          coinRatePerHour: input.coinRatePerHour,
          bio: input.bio,
          cvUrl: input.cvUrl,
          portfolioUrl: input.portfolioUrl || undefined,
          status: "APPROVED", // Auto approve
          rating: 5.0,
          totalSessions: 0,
        }
      });

      return tutor;
    }),

  /** Get current user's Tutor Profiles */
  getMyTutorProfiles: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;

    const tutors = await ctx.db.find({
      collection: "tutors",
      where: { user: { equals: user.id } },
      sort: "-createdAt",
    });

    return tutors.docs.map((t: any) => ({
      id: String(t.id),
      title: t.title,
      skills: t.skills?.map((s: any) => s.skill) || [],
      coinRatePerHour: t.coinRatePerHour,
      bio: t.bio,
      cvUrl: t.cvUrl,
      portfolioUrl: t.portfolioUrl,
      status: t.status,
      rating: t.rating,
      totalSessions: t.totalSessions,
    }));
  }),

  /** Request a mentoring session */
  requestSession: protectedProcedure
    .input(
      z.object({
        mentorId: z.number(),
        topic: z.string().min(3),
        scheduledAt: z.string(),
        priceCoins: z.number().min(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;
      const currentBalance = (user as any).wallet_balance ?? 0;

      if (currentBalance < input.priceCoins) {
        throw new Error("Saldo Nexora Coins tidak mencukupi untuk membooking sesi ini.");
      }

      // Create the session
      const session = await ctx.db.create({
        collection: "mentorship_sessions",
        data: {
          mentor: input.mentorId,
          mentee: user.id,
          topic: input.topic,
          scheduledAt: input.scheduledAt,
          priceCoins: input.priceCoins,
          status: "pending",
        },
      });

      // Deduct coins from mentee
      await ctx.db.update({
        collection: "users",
        id: user.id,
        data: {
          wallet_balance: currentBalance - input.priceCoins,
        },
      });

      return session;
    }),

  /** Accept a mentoring session (mentor only) */
  acceptSession: protectedProcedure
    .input(z.object({ sessionId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.update({
        collection: "mentorship_sessions",
        id: input.sessionId,
        data: { status: "accepted" },
      });
    }),

  /** Reject a mentoring session (mentor only) */
  rejectSession: protectedProcedure
    .input(z.object({ sessionId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const session: any = await ctx.db.findByID({
        collection: "mentorship_sessions",
        id: input.sessionId,
      });

      // Refund coins to mentee
      const menteeId = typeof session.mentee === "object" ? session.mentee.id : session.mentee;
      const mentee: any = await ctx.db.findByID({ collection: "users", id: menteeId });

      await ctx.db.update({
        collection: "users",
        id: menteeId,
        data: {
          wallet_balance: (mentee.wallet_balance ?? 0) + (session.priceCoins ?? 0),
        },
      });

      return await ctx.db.update({
        collection: "mentorship_sessions",
        id: input.sessionId,
        data: { status: "rejected" },
      });
    }),

  /** Complete a mentoring session — transfer coins to mentor + award XP */
  completeSession: protectedProcedure
    .input(z.object({ sessionId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const session: any = await ctx.db.findByID({
        collection: "mentorship_sessions",
        id: input.sessionId,
      });

      const mentorId = typeof session.mentor === "object" ? session.mentor.id : session.mentor;
      const menteeId = typeof session.mentee === "object" ? session.mentee.id : session.mentee;

      const mentor: any = await ctx.db.findByID({ collection: "users", id: mentorId });
      const mentee: any = await ctx.db.findByID({ collection: "users", id: menteeId });

      // Transfer coins to mentor
      await ctx.db.update({
        collection: "users",
        id: mentorId,
        data: {
          wallet_balance: (mentor.wallet_balance ?? 0) + (session.priceCoins ?? 0),
          xp_points: (mentor.xp_points ?? 0) + 30,
        },
      });

      // Award XP to mentee
      await ctx.db.update({
        collection: "users",
        id: menteeId,
        data: {
          xp_points: (mentee.xp_points ?? 0) + 20,
        },
      });

      return await ctx.db.update({
        collection: "mentorship_sessions",
        id: input.sessionId,
        data: { status: "completed" },
      });
    }),

  /** Get all sessions for the current user (as mentor or mentee) */
  getMySessions: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;

    const sessions = await ctx.db.find({
      collection: "mentorship_sessions",
      where: {
        or: [
          { mentor: { equals: user.id } },
          { mentee: { equals: user.id } },
        ],
      },
      sort: "-createdAt",
      depth: 2,
      limit: 50,
    });

    return sessions.docs.map((s: any) => {
      const isMentor =
        (typeof s.mentor === "object" ? s.mentor.id : s.mentor) === user.id;
      const partner = isMentor
        ? typeof s.mentee === "object" ? s.mentee : null
        : typeof s.mentor === "object" ? s.mentor : null;

      return {
        id: String(s.id),
        partnerName: partner?.fullName || partner?.username || "User",
        topic: s.topic,
        scheduledAt: s.scheduledAt,
        durationMinutes: 60,
        status: s.status as "pending" | "accepted" | "rejected" | "completed" | "cancelled",
        isMentor,
      };
    });
  }),
});
