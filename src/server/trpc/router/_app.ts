import { router } from "../trpc";
import { authRouter } from "./auth";
import { userRouter } from "./user";
import { adminRouter } from "./admin";
import { homeRouter } from "./home";
import { profileRouter } from "./profile";
import { logRouter } from "./log";
import { postRouter } from "./post";
import { commentRouter } from "./comment";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  admin: adminRouter,
  home: homeRouter,
  profile: profileRouter,
  log: logRouter,
  post: postRouter,
  comment: commentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
