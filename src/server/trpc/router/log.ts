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
});
