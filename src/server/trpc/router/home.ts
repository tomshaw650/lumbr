import { router, protectedProcedure } from "../trpc";
import { prisma } from "../../db/client";
import { TRPCError } from "@trpc/server";

export const homeRouter = router({
  explore: protectedProcedure.query(async ({ ctx }) => {
    const user = await prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      include: {
        interests: true,
      },
    });

    if (!user) throw new TRPCError({ code: "NOT_FOUND" });

    const logs = await prisma.log.findMany({
      take: 100,
      include: {
        log_tags: {
          include: {
            tag: true,
          },
        },
        user: true,
      },
      where: {
        log_tags: {
          some: {
            tag: {
              tag_id: {
                in: user.interests.map((interest) => interest.tag_id),
              },
            },
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return logs;
  }),
});
