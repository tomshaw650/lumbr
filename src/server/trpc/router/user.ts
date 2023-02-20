import { router, protectedProcedure } from "../trpc";
import { prisma } from "../../db/client";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const userRouter = router({
  // getUser query to get user data from prisma
  getUser: protectedProcedure.query(async ({ ctx }) => {
    const user = await prisma.user.findUnique({
      where: {
        id: ctx?.session?.user?.id,
      },
    });
    return user;
  }),
  update: protectedProcedure
    .input(
      z.object({
        name: z
          .string()
          .min(2, { message: "Name must be 2 characters or more." })
          .max(20, { message: "Name must be shorter than 20 characters." }),
        username: z
          .string()
          .min(3, { message: "Username must be 3 characters or more." })
          .max(20, { message: "Username must be shorter than 20 characters." }),
        interests: z.array(
          z.object({
            tag_id: z.string(),
            user_id: z.string(),
          })
        ),
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
          name: input.name,
          username: input.username,
          interests: {
            create: input.interests.map((tag: any) => ({
              tag: {
                connect: {
                  tag_id: tag.tag_id,
                },
              },
            })),
          },
        },
      });
      return user;
    }),
});
