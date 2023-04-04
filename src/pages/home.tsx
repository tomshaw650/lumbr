import { useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import NavBar from "../components/NavBar";
import ExploreView from "../components/ExploreView";

import { SiAddthis } from "react-icons/si";
import { LoadingPage } from "../components/loading";

const Home = () => {
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
        <title>Lumbr | Home</title>
      </Head>
      <NavBar user={user} />
      <div className="grid grid-cols-10">
        <section className="sticky col-span-2 flex h-screen flex-col border-r-2 border-neutral border-opacity-50">
          <h1 className="p-5 text-4xl font-bold">Your logs</h1>
          <Link
            className="flex items-center gap-x-2 pl-5 hover:text-primary"
            href="/log/create"
          >
            <span className="hidden text-xl underline sm:block">
              Create a log
            </span>
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
        <section className="col-span-8">
          <h1 className="p-5 text-4xl font-bold">Feed</h1>
          <ExploreView />
        </section>
      </div>
    </div>
  );
};

export default Home;
