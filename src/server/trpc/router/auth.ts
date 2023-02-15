import { router, publicProcedure, protectedProcedure } from "../trpc";
import { prisma } from "../../db/client";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
  getAllTags: publicProcedure.query(() => {
    return prisma.tag.findMany();
  }),
});
