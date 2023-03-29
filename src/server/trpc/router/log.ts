import { router, protectedProcedure, publicProcedure } from "../trpc";
import { prisma } from "../../db/client";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const logRouter = router({
  createLog: protectedProcedure
    .input(
      z.object({
        title: z
          .string()
          .min(2, { message: "Title must be 2 characters or more." })
          .max(20, { message: "Title must be shorter than 20 characters." }),
        description: z.string().max(60, {
          message: "Description must be shorter than 60 characters.",
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingLog = await prisma.log.findFirst({
        where: {
          user_id: ctx?.session?.user?.id,
          title: input.title,
        },
      });

      if (existingLog) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `You already have a log with title "${input.title}"`,
        });
      }

      const log = await prisma.log.create({
        data: {
          user_id: ctx?.session?.user?.id,
          title: input.title,
          description: input.description,
        },
      });
      return log;
    }),

  getUserLike: protectedProcedure
    .input(
      z.object({
        logId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const like = await prisma.likeLog.findFirst({
        where: {
          user_id: ctx?.session?.user?.id,
          log_id: input.logId,
        },
      });
      return like;
    }),

  getAllLikes: publicProcedure
    .input(
      z.object({
        logId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const likes = await prisma.likeLog.findMany({
        where: {
          log_id: input.logId,
        },
        include: {
          user: true,
        },
      });
      return likes;
    }),

  like: protectedProcedure
    .input(
      z.object({
        logId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const like = await prisma.likeLog.create({
        data: {
          user_id: ctx?.session?.user?.id,
          log_id: input.logId,
        },
      });
      return !!like;
    }),

  unlike: protectedProcedure
    .input(
      z.object({
        logId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const like = await prisma.likeLog.delete({
        where: {
          user_id_log_id: {
            user_id: ctx?.session?.user?.id,
            log_id: input.logId,
          },
        },
      });
      return !!like;
    }),
});
