import z from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const studyTasksRouter = createTRPCRouter({
  /** Get current user's tasks */
  getTasks: protectedProcedure
    .input(z.object({ category: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const user = ctx.session.user;

      const whereClause: any = {
        and: [{ user: { equals: user.id } }],
      };

      if (input?.category && input.category !== "Semua") {
        whereClause.and.push({ category: { equals: input.category } });
      }

      const tasks = await ctx.db.find({
        collection: "study-tasks",
        where: whereClause,
        sort: "deadline",
        limit: 100,
      });

      return tasks.docs.map((t: any) => ({
        id: String(t.id),
        title: t.title,
        category: t.category,
        deadline: t.deadline,
        status: t.status,
        checklists: t.checklists?.map((c: any) => ({
          id: c.id,
          taskName: c.taskName,
          isCompleted: c.isCompleted,
        })) || [],
      }));
    }),

  /** Create a new task */
  createTask: protectedProcedure
    .input(z.object({
      title: z.string().min(3),
      category: z.string(),
      deadline: z.string().optional(),
      checklists: z.array(z.object({
        taskName: z.string().min(1),
        isCompleted: z.boolean(),
      })),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;

      return await ctx.db.create({
        collection: "study-tasks",
        data: {
          user: user.id as any,
          title: input.title,
          category: input.category,
          deadline: input.deadline || undefined,
          status: "PENDING",
          checklists: input.checklists,
        }
      });
    }),

  /** Update a specific checklist item (toggle) */
  updateChecklist: protectedProcedure
    .input(z.object({
      taskId: z.string(),
      checklistId: z.string(),
      isCompleted: z.boolean(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;

      // Find the task
      const task: any = await ctx.db.findByID({
        collection: "study-tasks",
        id: input.taskId,
      });

      if (!task || (typeof task.user === "object" ? task.user.id !== user.id : task.user !== user.id)) {
        throw new Error("Task tidak ditemukan atau bukan milik Anda.");
      }

      const updatedChecklists = task.checklists?.map((c: any) => {
        if (c.id === input.checklistId) {
          return { ...c, isCompleted: input.isCompleted };
        }
        return c;
      }) || [];

      // Check if all are completed
      const allCompleted = updatedChecklists.length > 0 && updatedChecklists.every((c: any) => c.isCompleted);
      const newStatus = allCompleted ? "COMPLETED" : "PENDING";

      return await ctx.db.update({
        collection: "study-tasks",
        id: input.taskId,
        data: {
          status: newStatus,
          checklists: updatedChecklists,
        }
      });
    }),

  /** Delete a task */
  deleteTask: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;

      const task: any = await ctx.db.findByID({
        collection: "study-tasks",
        id: input.taskId,
      });

      if (!task || (typeof task.user === "object" ? task.user.id !== user.id : task.user !== user.id)) {
        throw new Error("Task tidak ditemukan atau bukan milik Anda.");
      }

      return await ctx.db.delete({
        collection: "study-tasks",
        id: input.taskId,
      });
    }),
});
