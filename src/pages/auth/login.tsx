import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";

const LogIn = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <main>Loading...</main>;
  }

  if (session) {
    router.push("/home");
  }

  return (
    <main>
      <h1>Lumbr</h1>
      <div>
        {session ? (
          <>
            <p>hi {session.user?.name}</p>
            <button
              onClick={() => {
                signOut().catch(console.log);
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <div>
            <button
              onClick={() => {
                signIn("github").catch(console.log);
              }}
            >
              Login with GitHub
            </button>
            <p>or</p>
            <button
              onClick={() => {
                signIn("google").catch(console.log);
              }}
            >
              Login with Google
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default LogIn;
