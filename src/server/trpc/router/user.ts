import { router, protectedProcedure } from "../trpc";
import { prisma } from "../../db/client";
import { z } from "zod";

export const userRouter = router({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    return ctx.session.user;
  }),
  update: protectedProcedure
    .input(
      z.object({
        name: z
          .string()
          .min(2, { message: "Must be 2 characters or more!" })
          .max(20, { message: "Must be shorter than 20 characters!" }),
        username: z
          .string()
          .min(2, { message: "Must be 2 characters or more!" })
          .max(20, { message: "Must be shorter than 20 characters!" }),
        interests: z.array(
          z.object({
            tag_id: z.string(),
            user_id: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
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
