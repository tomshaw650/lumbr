import { router, publicProcedure } from "../trpc";
import { prisma } from "../../db/client";
import { z } from "zod";

export const searchRouter = router({
  users: publicProcedure
    .input(
      z.object({
        query: z.string(),
      })
    )
    .query(async ({ input }) => {
      const users = await prisma.user.findMany({
        where: {
          username: {
            search: "*" + input.query + "*",
          },
          name: {
            search: "*" + input.query + "*",
          },
        },
      });
      return users;
    }),

  logs: publicProcedure
    .input(
      z.object({
        query: z.string(),
      })
    )
    .query(async ({ input }) => {
      const logs = await prisma.log.findMany({
        where: {
          title: {
            search: "*" + input.query + "*",
          },
          description: {
            search: "*" + input.query + "*",
          },
        },
        include: {
          user: true,
          log_tags: {
            include: {
              tag: true,
            },
          },
        },
      });
      return logs;
    }),

  posts: publicProcedure
    .input(
      z.object({
        query: z.string(),
      })
    )
    .query(async ({ input }) => {
      const posts = await prisma.post.findMany({
        where: {
          title: {
            search: "*" + input.query + "*",
          },
          content: {
            search: "*" + input.query + "*",
          },
        },
        include: {
          user: true,
        },
      });
      return posts;
    }),

  comments: publicProcedure
    .input(
      z.object({
        query: z.string(),
      })
    )
    .query(async ({ input }) => {
      const comments = await prisma.comment.findMany({
        where: {
          body: {
            search: "*" + input.query + "*",
          },
        },
        include: {
          user: true,
          log: true,
          post: true,
        },
      });
      return comments;
    }),
});
