import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import { trpc } from "../utils/trpc";

const Home = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const user = trpc.user.getUser.useQuery();

  if (status === "loading") {
    return <main>Loading...</main>;
  }

  if (!user.data?.username) {
    router.push("/auth/new-user");
  }

  if (!session) {
    router.push("/");
  }

  return (
    <div>
      <h1 className="text-4xl">This is the logged in homepage</h1>
      <h2 className="text-2xl">Welcome, {user.data?.username}!</h2>
      <button
        onClick={() => {
          signOut();
        }}
      >
        Sign Out
      </button>
    </div>
  );
};

export default Home;
