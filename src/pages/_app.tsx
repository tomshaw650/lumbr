import { type AppType } from "next/app";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Sofia_Sans } from "@next/font/google";
import { Toaster } from "react-hot-toast";

import { trpc } from "../utils/trpc";
import "../styles/globals.css";

const sofia_sans = Sofia_Sans({
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "arial"],
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Lumbr</title>
        <meta name="description" content="A place for developers to connect" />
        <meta
          name="viewport"
          content="width=device-width, minimum-scale=1, initial-scale=1"
        />
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={sofia_sans.className}>
        <Toaster position="bottom-center" />
        <Component {...pageProps} />
        <Analytics />
      </div>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
