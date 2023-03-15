import { router } from "../trpc";
import { authRouter } from "./auth";
import { userRouter } from "./user";
import { logRouter } from "./log";
import { postRouter } from "./post";
import { commentRouter } from "./comment";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  log: logRouter,
  post: postRouter,
  comment: commentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
