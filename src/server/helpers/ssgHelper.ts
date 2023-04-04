import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "../trpc/router/_app";
import { prisma } from "../db/client";
import superjson from "superjson";

export const generateSSGHelper = () => {
  createSSGHelpers({
    router: appRouter,
    ctx: { prisma, session: null },
    transformer: superjson, // optional - adds superjson serialization
  });
};
