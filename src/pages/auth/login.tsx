import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import SwitchTheme from "../../components/SwitchTheme";

const LogIn = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  // loading state
  if (status === "loading") {
    return <div>Loading...</div>;
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
            <Image alt="Lumbr logo" src="/lumbr.png" />
          </Link>
        </div>
        <div className="navbar-end flex-1 md:mr-10">
          <SwitchTheme />
        </div>
      </nav>
      <header className="flex flex-col place-items-center">
        <h1 className="text-5xl font-bold">Get Started!</h1>
        <ul className="steps steps-vertical lg:mt-10 lg:steps-horizontal">
          <li className="step-primary step font-bold" />
          <li className="step font-bold" />
          <li className="step font-bold" data-content="✓" />
        </ul>
      </header>
      <div className="flex flex-col items-center justify-around">
        <button
          onClick={() => {
            signIn("github").catch(console.log);
          }}
          className="btn-primary btn-lg btn text-white"
        >
          Login with GitHub
        </button>
        <p className="my-5 text-xl font-bold">--- or ---</p>
        <button
          onClick={() => {
            signIn("google").catch(console.log);
          }}
          className="btn-primary btn-lg btn text-white"
        >
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default LogIn;
