import { useState } from "react";
import type { NextPage } from "next";
import { trpc } from "../../utils/trpc";
import { GetStaticProps } from "next";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "../../server/trpc/router/_app";
import { prisma } from "../../server/db/client";
import superjson from "superjson";
import NavBar from "../../components/NavBar";

import UserView from "../../components/search/UserView";
import LogView from "../../components/search/LogView";
import PostView from "../../components/search/PostView";
import CommentView from "../../components/search/CommentView";

import { LoadingPage } from "../../components/loading";
import FourOhFour from "../404";

const SearchPage: NextPage<{ query: string }> = ({ query }) => {
  const [category, setCategory] = useState<
    "users" | "logs" | "posts" | "comments"
  >("users");
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = trpc.user.getUserPublic.useQuery();

  const {
    data: users,
    isLoading: isUsersLoading,
    error: usersError,
  } = trpc.search.users.useQuery({
    query,
  });

  const {
    data: logs,
    isLoading: isLogsLoading,
    error: logsError,
  } = trpc.search.logs.useQuery({
    query,
  });

  const {
    data: posts,
    isLoading: isPostsLoading,
    error: postsError,
  } = trpc.search.posts.useQuery({
    query,
  });

  const {
    data: comments,
    isLoading: isCommentsLoading,
    error: commentsError,
  } = trpc.search.comments.useQuery({
    query,
  });

  if (
    isUsersLoading ||
    isLogsLoading ||
    isPostsLoading ||
    isCommentsLoading ||
    userLoading
  ) {
    return <LoadingPage />;
  }

  if (usersError || logsError || postsError || commentsError || userError) {
    return <FourOhFour />;
  }

  const resultsLength =
    users.length + logs.length + posts.length + comments.length;

  const handleCategoryClick = (
    category: "users" | "logs" | "posts" | "comments"
  ) => {
    setCategory(category);
  };

  return (
    <div className="w-screen">
      <NavBar user={user} />
      <div className="grid grid-cols-10">
        <section className="col-span-7">
          <h1 className="p-10 text-3xl font-bold">
            {resultsLength} results for &apos;{query}&apos;
          </h1>
          {category === "users" && <UserView users={users} />}
          {category === "logs" && <LogView logs={logs} />}
          {category === "posts" && <PostView posts={posts} />}
          {category === "comments" && <CommentView comments={comments} />}
        </section>
        <section className="sticky col-span-3 flex h-screen flex-col">
          <ul className="menu rounded-box mt-10 bg-white md:max-w-sm">
            <li className="p-2 text-lg">
              <button
                className={`flex cursor-pointer justify-between ${
                  category === "users" ? "active" : ""
                }`}
                onClick={() => handleCategoryClick("users")}
              >
                <span>Users</span>
                <span className="font-bold">({users.length})</span>
              </button>
            </li>
            <li className="p-2 text-lg">
              <button
                className={`flex cursor-pointer justify-between ${
                  category === "logs" ? "active" : ""
                }`}
                onClick={() => handleCategoryClick("logs")}
              >
                <span>Logs</span>
                <span className="font-bold">({logs.length})</span>
              </button>
            </li>
            <li className="p-2 text-lg">
              <button
                className={`flex cursor-pointer justify-between ${
                  category === "posts" ? "active" : ""
                }`}
                onClick={() => handleCategoryClick("posts")}
              >
                <span>Posts</span>
                <span className="font-bold">({posts.length})</span>
              </button>
            </li>
            <li className="p-2 text-lg">
              <button
                className={`flex cursor-pointer justify-between ${
                  category === "comments" ? "active" : ""
                }`}
                onClick={() => handleCategoryClick("comments")}
              >
                <span>Comments</span>
                <span className="font-bold">({comments.length})</span>
              </button>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: { prisma, session: null },
    transformer: superjson, // optional - adds superjson serialization
  });

  const query = context.params?.query as string;

  if (typeof query !== "string") throw new Error("not a valid query");

  await ssg.search.users.prefetch({ query });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      query,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default SearchPage;
