import type { NextPage, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import NavBar from "../../components/NavBar";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "../../server/trpc/router/_app";
import { prisma } from "../../server/db/client";
import superjson from "superjson";
import { trpc } from "../../utils/trpc";
import { useSession } from "next-auth/react";
import { LoadingSpinner } from "../../components/loading";
import { SiAddthis } from "react-icons/si";
import formatDate from "../../utils/formatDate";

const EditProfileModal = () => {
  return (
    <div className="">
      <h1 className="text-2xl font-bold">Edit Profile</h1>
    </div>
  );
};

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data: user } = trpc.profile.getUserByUsername.useQuery({ username });
  const { data: session } = useSession();
  if (!user) return <div>404</div>;

  const { data: logs, isLoading } = trpc.log.getLogsByUserId.useQuery({
    userId: user?.id,
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <Head>
        <title>{user.username} | Lumbr</title>
        <meta name="description" content="Lumbr" />
      </Head>

      <NavBar user={session?.user} />
      <div className="grid grid-cols-10">
        <section className="sticky col-span-2 flex h-screen flex-col border-r-2 border-neutral border-opacity-50">
          <div className="mt-16 p-2">
            <Image
              priority={true}
              src={user.image ? user.image : "/user.png"}
              alt="Commenter's Profile Picture"
              width="220"
              height="220"
              className="mx-auto rounded-full border-4 border-black"
            />
            <h1 className="ml-5 mt-3 text-3xl font-bold">{user.name}</h1>
            <h2 className="ml-5 text-xl">{user.username}</h2>
            {user.bio !== null && (
              <p className="mt-5 rounded border-2 border-neutral p-2">
                {user.bio}
              </p>
            )}
            {session?.user?.id === user.id && (
              <>
                <label
                  htmlFor="edit-profile"
                  className="btn-primary btn mt-5 text-white"
                >
                  Edit Profile
                </label>
                <input
                  type="checkbox"
                  id="edit-profile"
                  className="modal-toggle"
                />
                <div className="modal">
                  <div className="modal-box">
                    <EditProfileModal />
                    <div className="modal-action">
                      <label htmlFor="edit-profile" className="btn-circle btn">
                        X
                      </label>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
        <section className="col-span-8 p-10">
          <div className="flex items-center gap-x-2">
            <h3 className="mb-5 p-2 text-3xl">{user.username}'s logs</h3>
            {session?.user?.id === user.id && (
              <Link href="/log/create">
                <SiAddthis className="mb-5 text-xl hover:text-primary" />
              </Link>
            )}
          </div>
          {logs?.map((log) => (
            <div key={log.log_id} className="mb-5 flex items-center gap-x-2">
              <Link
                href={`/log/${log.log_id}`}
                className="w-full max-w-xl hover:shadow-lg"
              >
                <div
                  key={log.log_id}
                  className="flex flex-col rounded border-2 border-solid border-primary p-2"
                >
                  <span className="text-xl font-bold">{log.title}</span>
                  <span className="font-semibold">{log.description}</span>
                  <ul className="mt-1 flex flex-wrap gap-x-2 gap-y-1">
                    {log.log_tags.map((log_tag) => (
                      <li
                        className="badge-primary badge text-white"
                        key={log_tag.tag_id}
                      >
                        {log_tag.tag.tag_name}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-1 text-primary">
                    Created on {formatDate(log.created_at.toISOString())}
                  </span>
                </div>
              </Link>
            </div>
          ))}
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

  const username = context.params?.username as string;

  if (typeof username !== "string") throw new Error("no username");

  await ssg.profile.getUserByUsername.prefetch({ username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ProfilePage;
