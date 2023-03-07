import { router } from "../trpc";
import { authRouter } from "./auth";
import { userRouter } from "./user";
import { logRouter } from "./log";
import { postRouter } from "./post";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  log: logRouter,
  post: postRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
