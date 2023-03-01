import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import NavBar from "../components/NavBar";
import { useEffect } from "react";

const Home = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data, isLoading } = trpc.user.getUser.useQuery();

  useEffect(() => {
    if (!isLoading && !data?.username) {
      router.push("/auth/new-user");
    }
  }, [data, isLoading, router]);

  if (status === "loading" && isLoading) {
    return <main>Loading...</main>;
  }

  if (!session) {
    router.push("/");
  }

  return (
    <div>
      <Head>
        <title>Lumbr | Home</title>
      </Head>
      <NavBar user={data} />
    </div>
  );
};

export default Home;
