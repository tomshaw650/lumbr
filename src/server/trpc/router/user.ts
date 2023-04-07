import { router, protectedProcedure, publicProcedure } from "../trpc";
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

  getAllLogs: protectedProcedure.query(async ({ ctx }) => {
    const logs = await prisma.log.findMany({
      where: {
        user_id: ctx?.session?.user?.id,
      },
    });
    return logs;
  }),

  // getUserPublic query to get user data from prisma, only trying once
  getUserPublic: publicProcedure.query(async ({ ctx }) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: ctx?.session?.user?.id,
        },
        rejectOnNotFound: true, // throw an error if user is not found
      });
      return user;
    } catch (error) {
      // handle error here, e.g. return null or throw a custom error
      return null;
    }
  }),

  // update mutation to add name, username and interests to user
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

  getInterests: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const interests = await prisma.userTag.findMany({
        where: {
          user_id: input.userId,
        },
        include: {
          tag: true,
        },
      });
      return interests;
    }),

  removeTagFromUser: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        tagId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const userTag = await prisma.userTag.findUnique({
        where: {
          user_id_tag_id: {
            user_id: input.userId,
            tag_id: input.tagId,
          },
        },
      });

      if (userTag) {
        await prisma.userTag.delete({
          where: {
            user_id_tag_id: {
              user_id: input.userId,
              tag_id: input.tagId,
            },
          },
        });
      }
      return userTag;
    }),

  addTagToUser: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        interests: z.array(
          z.object({
            tag_id: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const user = await prisma.user.update({
        where: {
          id: input.userId,
        },
        data: {
          interests: {
            create: input.interests,
          },
        },
      });
      return user;
    }),

  follow: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const follow = await prisma.follow.create({
        data: {
          followed_user_id: input.userId,
          following_user_id: ctx?.session?.user?.id,
        },
      });
      return follow;
    }),

  unfollow: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const follow = await prisma.follow.delete({
        where: {
          followed_user_id_following_user_id: {
            followed_user_id: input.userId,
            following_user_id: ctx?.session?.user?.id,
          },
        },
      });
      return follow;
    }),

  getFollowers: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const followers = await prisma.follow.findMany({
        where: {
          followed_user_id: input.userId,
        },
        include: {
          following_user: true,
        },
      });
      return followers;
    }),

  getFollowing: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const following = await prisma.follow.findMany({
        where: {
          following_user_id: input.userId,
        },
        include: {
          followed_user: true,
        },
      });
      return following;
    }),

  isFollowing: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const follow = await prisma.follow.findUnique({
        where: {
          followed_user_id_following_user_id: {
            followed_user_id: input.userId,
            following_user_id: ctx?.session?.user?.id,
          },
        },
      });
      return !!follow;
    }),
});
