import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import NavBar from "../components/NavBar";

const Home = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data, isLoading } = trpc.user.getUser.useQuery();

  if (status === "loading" && isLoading) {
    return <main>Loading...</main>;
  }

  if (!isLoading && !data?.username) {
    router.push("/auth/new-user");
  }

  if (!session) {
    router.push("/");
  }

  return (
    <div>
      <NavBar user={data} />
    </div>
  );
};

export default Home;
