import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { LoadingPage } from "../components/loading";

import dynamic from "next/dynamic";
const SwitchTheme = dynamic(() => import("../components/SwitchTheme"), {
  ssr: false,
});

const LandingPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <LoadingPage />;
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Head>
        <title>Lumbr</title>
      </Head>
      <nav className="navbar flex">
        <div className="flex-none">
          <Link href="/" className="btn-ghost btn-circle btn ml-5 md:ml-10">
            <Image src="/lumbr.png" alt="Lumbr logo" width="100" height="100" />
          </Link>
        </div>
        <ul className="flex-1">
          <li className="link ml-5 normal-case sm:text-lg md:ml-20">
            <Link href="/what-is-lumbr" className="hover:font-bold">
              what is lumbr?
            </Link>
          </li>
        </ul>
        <SwitchTheme />
        <div className="flex-none">
          {!session && (
            <button
              onClick={() => {
                router.push("/auth/login");
              }}
              className="btn-primary btn-sm btn ml-2 text-white sm:btn-lg"
            >
              Login
            </button>
          )}
          {session && (
            <button
              onClick={() => {
                signOut();
              }}
              className="btn-primary btn-sm btn ml-2 text-white sm:btn-lg"
            >
              Logout
            </button>
          )}
        </div>
      </nav>
      <section className="grid grid-cols-1 grid-rows-2 place-content-center place-items-end pb-16 md:grid-cols-2">
        <div className="md:row-span-auto row-span-2 mx-auto mt-10 place-self-center p-10 sm:ml-10">
          <h1 className="mb-4 text-5xl font-bold md:text-6xl">
            A place to connect.
          </h1>
          <p className="mb-4 text-2xl">
            Welcome to lumbr. This is the place for developers to come together,
            share what they’ve been working on, and learn from one another!
          </p>
          {!session && (
            <button
              onClick={() => {
                router.push("/auth/login");
              }}
              className="btn-primary btn-wide btn text-white"
            >
              Join here
            </button>
          )}
          {session && (
            <button
              onClick={() => {
                router.push("/home");
              }}
              className="btn-primary btn-wide btn text-white"
            >
              Go to Home
            </button>
          )}
        </div>
        <div className="col-span-1 row-span-1 md:col-span-1 md:col-start-2 md:row-span-2">
          <Image
            priority={true}
            width={500}
            height={500}
            src="/robots.png"
            alt="Happy little robots"
            className="mx-auto h-4/5 w-4/5"
          />
        </div>
      </section>

      <footer className="footer absolute bottom-0 left-0 flex w-full bg-neutral p-10 text-white">
        <span>© 2023 Lumbr</span>
        <Link href="https://github.com/tomshaw650/" className="ml-5 underline">
          GitHub
        </Link>
        <Link href="https://twitter.com/tomshawdev" className="ml-5 underline">
          Twitter
        </Link>
      </footer>
    </div>
  );
};

export default LandingPage;
