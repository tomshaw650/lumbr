import { router, publicProcedure, protectedProcedure } from "../trpc";
import { prisma } from "../../db/client";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const profileRouter = router({
  getUserByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: {
          username: input.username,
        },
      });
      return user;
    }),

  edit: protectedProcedure
    .input(
      z.object({
        username: z
          .string()
          .min(3, { message: "Username must be 3 characters or more." })
          .max(20, { message: "Username must be shorter than 20 characters." }),
        name: z
          .string()
          .min(2, { message: "Name must be 2 characters or more." })
          .max(20, { message: "Name must be shorter than 20 characters." }),
        bio: z
          .string()
          .max(60, { message: "Bio must be shorter than 60 characters." }),
        image: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // if the username has any whitespace, throw error
      if (/\s/.test(input.username)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Username cannot contain any whitespace!",
        });
      }

      const user = await prisma.user.update({
        where: {
          id: ctx?.session?.user?.id,
        },
        data: {
          username: input.username,
          name: input.name,
          bio: input.bio,
          image: input.image,
        },
      });
      return user;
    }),
});
