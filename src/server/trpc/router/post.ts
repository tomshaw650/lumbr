import { router, protectedProcedure, publicProcedure } from "../trpc";
import { prisma } from "../../db/client";
import { z } from "zod";
import xss from "xss";
import { TRPCError } from "@trpc/server";

export const postRouter = router({
  createPost: protectedProcedure
    .input(
      z.object({
        title: z
          .string()
          .min(2, { message: "Title must be 2 characters or more." })
          .max(30, { message: "Title must be shorter than 30 characters." }),
        content: z
          .string()
          .min(1, {
            message: "Content must be 1 character or more.",
          })
          .max(2000, {
            message: "Content must be shorter than 1000 characters.",
          }),
        log_id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const sanitisedMd = xss(input.content);

      const existingPost = await prisma.post.findFirst({
        where: {
          user_id: ctx?.session?.user?.id,
          title: input.title,
        },
      });

      if (!input.log_id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `You must post to a log.`,
        });
      }

      if (existingPost) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `You already have a post with title "${input.title}"`,
        });
      }

      const post = await prisma.post.create({
        data: {
          user_id: ctx?.session?.user?.id,
          title: input.title,
          content: sanitisedMd,
          logs: {
            connect: {
              log_id: input.log_id,
            },
          },
        },
      });
      return post;
    }),

  getUserLike: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const like = await prisma.likePost.findFirst({
        where: {
          user_id: ctx?.session?.user?.id,
          post_id: input.postId,
        },
      });
      return like;
    }),

  getAllLikes: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const likes = await prisma.likePost.findMany({
        where: {
          post_id: input.postId,
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
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const like = await prisma.likePost.create({
        data: {
          user_id: ctx?.session?.user?.id,
          post_id: input.postId,
        },
      });
      return !!like;
    }),

  unlike: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const like = await prisma.likePost.delete({
        where: {
          user_id_post_id: {
            user_id: ctx?.session?.user?.id,
            post_id: input.postId,
          },
        },
      });
      return !!like;
    }),
});
