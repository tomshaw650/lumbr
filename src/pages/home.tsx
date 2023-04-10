import { useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import NavBar from "../components/NavBar";
import ExploreView from "../components/ExploreView";

import { SiAddthis } from "react-icons/si";
import { RxHamburgerMenu } from "react-icons/rx";
import { LoadingPage } from "../components/loading";

const Explore = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { data: user, isLoading: userIsLoading } = trpc.user.getUser.useQuery();
  const { data: logs, isLoading: logsIsLoading } =
    trpc.user.getAllLogs.useQuery();

  useEffect(() => {
    if (!userIsLoading && !user?.username) {
      router.push("/auth/new-user");
    }
  }, [user, userIsLoading, router]);

  if (userIsLoading || logsIsLoading) {
    return <LoadingPage />;
  }

  if (!session) {
    router.push("/");
  }

  return (
    <div>
      <Head>
        <title>Lumbr | Explore</title>
      </Head>
      <NavBar user={user} />
      <div className="grid grid-cols-1 sm:grid-cols-10">
        <section className="flex flex-col sm:col-span-2 sm:h-screen sm:border-r-2 sm:border-neutral sm:border-opacity-50">
          <h1 className="p-5 text-center text-4xl font-bold">Your logs</h1>
          <Link
            className="flex items-center gap-x-2 pl-5 hover:text-primary"
            href="/log/create"
          >
            <span className="text-xl underline">Create a log</span>
            <SiAddthis className="text-xl" />
          </Link>
          <ul className="flex list-disc flex-col gap-y-2 p-10">
            {logs?.map((log) => (
              <li key={log.log_id}>
                <Link href={`/log/${log.log_id}`}>
                  <span className="hover:text-primary">{log.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="sm:col-span-8">
          <div className="dropdown-arrow dropdown-hover dropdown-end dropdown dropdown-bottom">
            <div className="flex items-center">
              <h1 className="py-5 pl-5 text-center text-2xl font-bold sm:text-4xl">
                Feed - Explore
              </h1>
              <label tabIndex={0} className="btn-ghost btn-circle btn">
                <RxHamburgerMenu className="text-2xl" />
              </label>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box w-52 bg-white p-2 shadow"
            >
              <li>
                <Link href="/home/explore">Explore</Link>
              </li>
              <li>
                <Link href="/home/following">Following</Link>
              </li>
            </ul>
          </div>
          <ExploreView />
        </section>
      </div>
    </div>
  );
};

export default Explore;
