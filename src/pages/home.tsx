import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";

const Home = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <main>Loading...</main>;
  }

  if (!session) {
    router.push("/");
  }

  return (
    <main>
      <h1 className="text-4xl">This is the logged in homepage</h1>
      <button
        onClick={() => {
          signOut();
        }}
      >
        Sign Out
      </button>
    </main>
  );
};

export default Home;
