import { GetStaticProps } from "next";
import React from "react";
import Link from "next/link";
import { prisma } from "../../server/db/client";
import { trpc } from "../../utils/trpc";
import { Log } from "../../types/prisma";
import NavBar from "../../components/NavBar";
import BackLink from "../../components/BackLink";

const Log = (props: { log: Log }) => {
  const { data, isLoading } = trpc.user.getUserPublic.useQuery();

  // wait until we have the user data before rendering the page
  if (isLoading) return <div>Loading...</div>;

  // if the log doesn't exist, return a 404 page (TODO)
  if (!props.log) return <div>Log not found</div>;

  console.log(window.innerWidth);

  const links = [
    { href: "/home", text: "Home", current: false },
    {
      href: `/u/${props.log.user.username}`,
      text: props.log.user.username,
      current: false,
    },
    { href: window.location.href, text: props.log.title, current: true },
  ];

  return (
    <div>
      <NavBar user={data} />
      <div className="ml-5 mt-2 flex">
        {links.map((link, index) => {
          return (
            <BackLink
              key={index}
              href={link.href}
              text={link.text}
              current={link.current}
            />
          );
        })}
      </div>
      <div className="mx-auto mt-10 flex max-w-md flex-col items-center rounded-md border-2 border-black border-opacity-20 py-2">
        <h1 className="text-2xl font-bold">{props.log.title}</h1>
        <p className="text-sm text-gray-500">
          by{" "}
          <Link
            className="underline hover:font-bold"
            href={`/u/${props.log.user.username}`}
          >
            {props.log.user.username}
          </Link>
        </p>
        <p className="mt-5 max-w-sm text-center">{props.log.description}</p>
      </div>
      <div className="mt-10 flex flex-col items-center">
        {props.log.posts.map((post) => (
          <Link
            key={post.post_id}
            className="w-full max-w-md md:max-w-lg"
            href={`/post/${post.post_id}`}
          >
            <div className="mt-5 rounded-md border-2 border-black border-opacity-20 bg-white p-5 hover:shadow-md dark:hover:drop-shadow-[0_4px_3px_rgba(255,255,255,0.2)]">
              <h2 className="text-xl font-bold dark:text-primary">
                {post.title}
              </h2>
              <p className="text-sm text-gray-500">
                on {formatDate(post.created_at)}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <div className="divider mt-5" />
      <h2 className="text-2xl font-bold">Comments</h2>
    </div>
  );
};

// take the ISOString and format it to a readable date (UK format)
const formatDate = (date: string) => {
  const dateFormatter = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return dateFormatter.format(new Date(date));
};

// get the log id from the url and prepare the data prop for the page
export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params || !params.id || typeof params.id !== "string") {
    return {
      notFound: true,
      revalidate: 60,
    };
  }
  const id = params.id;

  const logInfo = await prisma.log.findFirst({
    where: {
      log_id: {
        equals: id,
      },
    },
    include: {
      user: true, // bring in the related user
      posts: true, // bring in the related posts
    },
  });

  if (!logInfo) {
    return {
      notFound: true,
      revalidate: 60,
    };
  }

  const logWithSerializedData = {
    ...logInfo,
    created_at: logInfo?.created_at.toISOString(),
    updated_at: logInfo?.updated_at.toISOString(),
    posts: logInfo.posts.map((post) => ({
      ...post,
      created_at: post.created_at.toISOString(),
      updated_at: post.updated_at.toISOString(),
    })),
  };

  return { props: { log: logWithSerializedData }, revalidate: 60 };
};

// tell nextjs to generate the page for each log id
export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" };
}

export default Log;
