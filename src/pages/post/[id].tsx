import type { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { prisma } from "../../server/db/client";
import { trpc } from "../../utils/trpc";
import { Post } from "../../types/prisma";
import NavBar from "../../components/NavBar";
import BackLink from "../../components/BackLink";
import { Log } from "@prisma/client";

const Post = (props: { post: Post }) => {
  const { data, isLoading } = trpc.user.getUserPublic.useQuery();

  const log = props.post.logs?.[0];

  // wait until we have the user data before rendering the page
  if (isLoading) return <div>Loading...</div>;

  // if the log doesn't exist, return a 404 page (TODO)
  if (!props.post) return <div>Post not found</div>;

  if (!log) return <div>Log not found</div>;

  const links = [
    { href: "/home", text: "Home", current: false },
    {
      href: `/u/${props.post.user.username}`,
      text: props.post.user.username,
      current: false,
    },
    {
      href: `/log/${log?.log_id}`,
      text: log?.title,
      current: false,
    },
    { href: window.location.href, text: props.post.title, current: true },
  ];

  return (
    <div>
      <Head>
        <title>
          Lumbr | {props.post.user.username} - {props.post.title}
        </title>
      </Head>
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
      <div className="mx-auto mt-10 flex max-w-xs flex-col items-center rounded-md border-2 border-black border-opacity-20 py-2 sm:max-w-md">
        <h1 className="text-2xl font-bold">{props.post.title}</h1>
        <p className="text-sm text-gray-500">
          by{" "}
          <Link
            className="underline hover:font-bold"
            href={`/u/${props.post.user.username}`}
          >
            {props.post.user.username}
          </Link>
        </p>
        <p>{formatDate(props.post.created_at)}</p>
      </div>
      <div className="mx-auto mt-5 flex max-w-xs rounded-md border-2 border-black border-opacity-20 bg-white p-5 dark:bg-inherit sm:max-w-4xl">
        <p>{props.post.content}</p>
      </div>
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

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params || !params.id || typeof params.id !== "string") {
    return {
      notFound: true,
      revalidate: 60,
    };
  }
  const id = params.id;

  const postInfo = await prisma.post.findFirst({
    where: {
      post_id: {
        equals: id,
      },
    },
    include: {
      user: true, // bring in the related user
      logs: true, // bring in the related log
    },
  });

  if (!postInfo) {
    return {
      notFound: true,
      revalidate: 60,
    };
  }

  const postWithSerializedData = {
    ...postInfo,
    created_at: postInfo?.created_at.toISOString(),
    updated_at: postInfo?.updated_at.toISOString(),
    logs: postInfo.logs.map((log: Log) => ({
      ...log,
      created_at: log.created_at.toISOString(),
      updated_at: log.updated_at.toISOString(),
    })),
  };

  return { props: { post: postWithSerializedData }, revalidate: 60 };
};

// tell nextjs to generate the page for each log id
export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" };
}

export default Post;
