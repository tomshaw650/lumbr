import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const LandingPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <main>Loading...</main>;
  }

  return (
    <main>
      <h1 className="text-4xl">This is the basic landing page</h1>
      {!session && (
      <button
        onClick={() => {
          router.push("/auth/login");
        }}
      >
        Login
      </button>
      )}
    </main>
  );
};

export default LandingPage;
