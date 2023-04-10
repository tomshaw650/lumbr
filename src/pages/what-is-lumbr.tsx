import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
const SwitchTheme = dynamic(() => import("../components/SwitchTheme"), {
  ssr: false,
});

const WhatIsLumbr = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col">
      <Head>
        <title>Lumbr | What is Lumbr?</title>
        <meta name="description" content="What is Lumbr?" />
      </Head>
      <nav className="navbar flex flex-none items-center justify-between p-4">
        <Link href="/" className="btn-ghost btn-circle btn">
          <Image src="/lumbr.png" alt="Lumbr logo" width="80" height="80" />
        </Link>
        <div className="navbar-end flex-1">
          <SwitchTheme />
        </div>
      </nav>
      <div className="flex flex-grow flex-col items-center justify-center p-4">
        <h1 className="mb-4 text-center text-3xl">What is Lumbr?</h1>
        <div className="max-w-md">
          <p className="mb-4">
            Lumbr is a project by me, Tom Shaw, to act as the project
            deliverable of my Bachelor&apos;s Degree dissertation.
          </p>
          <p className="mb-4">
            The basis is to improve and enrich developer interactions on the
            internet. I&apos;ve felt for a while that developers are missing a
            <span className="italic">home</span> online, and merely settled
            across a few different spaces that don&apos;t quite fit. I want to
            create a space that is tailored to developers, and is a place where
            they can feel at home.
          </p>
          <h2 className="mb-4 text-xl">So what do I do here?</h2>
          <p className="mb-4">
            I used OAuth for signups, so connect with your GitHub account, and a
            profile will be made for you. You can add some interests, and the
            homepage will show you logs tagged the same way. You can also start
            writing your own logs, which are made up of posts about a side
            project, or a piece of work (that you&apos;re allowed to talk
            about!). There&apos;s a comment section, so get discussing with
            others, make friends, and be nice!
          </p>
          <p className="mb-4">
            I really hope you enjoy your stay here, and that you&apos;ll give it
            a try. This ultimately acts as a prototype and is not finished, but
            I&apos;m proud of what I made. I hope to read some logs other than
            my own!
          </p>
          <p className="mb-4">Sound good?</p>
          <button
            onClick={() => router.push("/auth/login")}
            className="btn-primary btn w-full text-white"
          >
            Join here!
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhatIsLumbr;
