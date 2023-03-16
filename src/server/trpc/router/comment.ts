import { router, protectedProcedure, publicProcedure } from "../trpc";
import { prisma } from "../../db/client";
import { z } from "zod";

export const commentRouter = router({
  getAll: publicProcedure
    .input(
      z.object({
        logId: z.optional(z.string()),
        postId: z.optional(z.string()),
      })
    )
    .query(async ({ input }) => {
      const comments = await prisma.comment.findMany({
        where: {
          log_id: input.logId,
          post_id: input.postId,
        },
        include: {
          user: true,
        },
      });
      return comments;
    }),

  create: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        logId: z.optional(z.string()),
        postId: z.optional(z.string()),
        body: z
          .string()
          .min(1, "Commment must have at least 1 character")
          .max(240, "Comment must be less than 240 characters"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const comment = await prisma.comment.create({
        data: {
          log_id: input.logId || null,
          post_id: input.postId || null,
          user_id: ctx?.session?.user?.id,
          body: input.body,
        },
      });
      return comment;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        comment_id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const comment = await prisma.comment.delete({
        where: {
          comment_id: input.comment_id,
        },
      });
      return comment;
    }),
});
