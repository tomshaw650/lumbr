import { router } from "../trpc";
import { authRouter } from "./auth";
import { userRouter } from "./user";
import { logRouter } from "./log";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  log: logRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
