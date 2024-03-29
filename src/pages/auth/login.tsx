import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { LoadingPage } from "../../components/loading";

import dynamic from "next/dynamic";
const SwitchTheme = dynamic(() => import("../../components/SwitchTheme"), {
  ssr: false,
});

const LogIn = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  // loading state
  if (status === "loading") {
    return <LoadingPage />;
  }

  // if the user is logged in, redirect to home page
  if (session) {
    router.push("/home");
  }

  return (
    <div className="flex w-full flex-col">
      <Head>
        <title>Lumbr | Login</title>
      </Head>
      <nav className="navbar flex">
        <div className="flex-none">
          <Link href="/" className="btn-ghost btn-circle btn ml-10">
            <Image src="/lumbr.png" alt="Lumbr logo" width="100" height="100" />
          </Link>
        </div>
        <div className="navbar-end mr-10 flex-1">
          <SwitchTheme />
        </div>
      </nav>
      <header className="mt-10 flex flex-col place-items-center">
        <h1 className="text-5xl font-bold">Get Started!</h1>
      </header>
      <div className="flex flex-col items-center justify-around">
        <ul className="steps steps-vertical ml-4 sm:mt-10">
          <li className="step-primary step font-bold" />
          <li className="step font-bold" />
          <li className="step font-bold" data-content="✓" />
        </ul>
        <button
          onClick={() => {
            signIn("github").catch(console.log);
          }}
          className="btn-primary btn-lg btn text-white"
        >
          Login with GitHub
        </button>
      </div>
    </div>
  );
};

export default LogIn;
