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
          .max(30, { message: "Title must be shorter than 30 characters." }),
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

  getLogById: publicProcedure
    .input(
      z.object({
        logId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const log = await prisma.log.findUnique({
        where: {
          log_id: input.logId,
        },
        include: {
          user: true,
        },
      });
      return log;
    }),

  addTagsToLog: protectedProcedure
    .input(
      z.object({
        logId: z.string(),
        log_tags: z.array(
          z.object({
            tag_id: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const log = await prisma.log.update({
        where: {
          log_id: input.logId,
        },
        data: {
          log_tags: {
            create: input.log_tags,
          },
        },
      });
      return log;
    }),

  removeTagFromLog: protectedProcedure
    .input(
      z.object({
        logId: z.string(),
        tagId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const logTag = await prisma.logTag.findUnique({
        where: {
          log_id_tag_id: {
            log_id: input.logId,
            tag_id: input.tagId,
          },
        },
      });

      if (logTag) {
        await prisma.logTag.delete({
          where: {
            log_id_tag_id: {
              log_id: input.logId,
              tag_id: input.tagId,
            },
          },
        });
      }
      return logTag;
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

  getLogTags: publicProcedure
    .input(
      z.object({
        logId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const logTags = await prisma.logTag.findMany({
        where: {
          log_id: input.logId,
        },
        include: {
          tag: true,
        },
      });
      return logTags;
    }),

  getLogsByUserId: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const logs = await prisma.log.findMany({
        where: {
          user_id: input.userId,
        },
        include: {
          log_tags: {
            include: {
              tag: true,
            },
          },
        },
      });
      return logs;
    }),

  report: protectedProcedure
    .input(
      z.object({
        logId: z.string(),
        reporterId: z.string(),
        userId: z.string(),
        reason: z
          .string()
          .min(2, { message: "Reason must be 2 characters or more." })
          .max(60, { message: "Reason must be shorter than 60 characters." }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingReport = await prisma.report.findFirst({
        where: {
          log_id: input.logId,
          reporter_id: ctx?.session?.user?.id,
          user_id: input.userId,
        },
      });

      if (existingReport) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `You already reported this log.`,
        });
      }

      const report = await prisma.report.create({
        data: {
          log_id: input.logId,
          reporter_id: ctx?.session?.user?.id,
          user_id: input.userId,
          reason: input.reason,
        },
      });
      return report;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        logId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const log = await prisma.log.findUnique({
        where: {
          log_id: input.logId,
        },
      });

      if (!log) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Log not found.`,
        });
      }

      if (log.user_id !== ctx?.session?.user?.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `You are not the owner of this log.`,
        });
      }

      await prisma.log.delete({
        where: {
          log_id: input.logId,
        },
      });
      return true;
    }),
});
