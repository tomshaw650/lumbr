import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import SwitchTheme from "../components/SwitchTheme";

const LandingPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <nav className="navbar flex">
        <div className="flex-none">
          <button className="dbtn btn-ghost btn-circle ml-10">Logo</button>
        </div>
        <ul className="ml-20 flex-1">
          <li className="btn-ghost btn text-lg normal-case">what is lumbr?</li>
        </ul>
        <div className="flex-none">
          <SwitchTheme />
          {!session && (
            <button
              onClick={() => {
                router.push("/auth/login");
              }}
              className="btn-primary btn-lg btn ml-20 mr-5 text-white"
            >
              Login
            </button>
          )}
        </div>
      </nav>
      <section className="grid w-full grid-cols-1 grid-rows-2 place-content-center place-items-end md:grid-cols-2">
        <div className="md:row-span-auto row-span-2 mx-auto mt-10 ml-10 place-self-center p-10">
          <h1 className="mb-4 text-5xl font-bold md:text-6xl">
            A place to connect.
          </h1>
          <p className="mb-4 text-2xl">
            Welcome to lumbr. This is the place for developers to come together,
            share what they’ve been working on, and learn from one another!
          </p>
          <button className="btn-primary btn-wide btn text-white">
            Join here
          </button>
        </div>
        <div className="col-span-1 row-span-1 md:col-span-1 md:col-start-2 md:row-span-2">
          <img
            src="robots.png"
            alt="Happy little robots"
            className="mx-auto h-4/5 w-4/5"
          />
        </div>
      </section>

      <footer className="footer bg-neutral p-10"></footer>
    </div>
  );
};

export default LandingPage;
