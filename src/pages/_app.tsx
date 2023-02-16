import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Sofia_Sans } from "@next/font/google"

import { trpc } from "../utils/trpc";
import "../styles/globals.css";

const sofia_sans = Sofia_Sans({ subsets: ["latin"], display: "swap" });

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <main className={sofia_sans.className}>
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
