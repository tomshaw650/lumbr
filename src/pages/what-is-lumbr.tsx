import { useRouter } from "next/router";

const WhatIsLumbr = () => {
  const router = useRouter();

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="mb-8 text-4xl">What is Lumbr?</h1>
      <div className="max-w-2xl">
        <p className="mb-4">
          Lumbr is a project by me, Tom Shaw, to act as my project deliverable
          of my Bachelor's Degree dissertation.
        </p>
        <p className="mb-4">
          The basis is to improve and enrich developer interactions on the
          internet. I've felt for a while that developers are missing a "home"
          online, and merely settled across a few different spaces that don't
          quite fit. I want to create a space that is tailored to developers,
          and is a place where they can feel at home.
        </p>
        <h2 className="mb-4 text-2xl">So what do I do here?</h2>
        <p className="mb-4">
          I used OAuth for signups, so connect with your GitHub account, and a
          profile will be made for you. You can add some interests, and the
          homepage will show you logs tagged the same way. You can also start
          writing your own logs, which are made up of posts about a side
          project, or a piece of work (that you're allowed to talk about!).
          There's a comment section, so get discussing with others, make
          friends, and be nice!
        </p>
        <p className="mb-4">
          I really hope you enjoy your stay here, and that you'll give it a try.
          This ultimately acts as a prototype and is not finished, but I'm proud
          of what I made. I hope to read some logs other than mine!
        </p>
        <p className="mb-4">Sound good?</p>
        <button
          onClick={() => router.push("/auth/login")}
          className="btn-primary btn text-white"
        >
          Join here!
        </button>
      </div>
    </div>
  );
};

export default WhatIsLumbr;
