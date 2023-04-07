import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import SwitchTheme from "../components/SwitchTheme";

const FourOhFour = () => {
  const router = useRouter();

  return (
    <>
      <nav className="navbar flex">
        <div className="flex-none">
          <Link href="/" className="btn-ghost btn-circle btn ml-10">
            <Image src="/lumbr.png" alt="Lumbr logo" width="100" height="100" />
          </Link>
        </div>
        <div className="navbar-end flex-1 md:mr-10">
          <SwitchTheme />
        </div>
      </nav>
      <div className="mt-10 flex flex-col items-center justify-center">
        <h1 className="mb-8 text-4xl">Oh No!</h1>
        <div className="flex max-w-2xl flex-col text-center">
          <Image
            priority={true}
            width={200}
            height={200}
            src="/404.png"
            alt="Sad little robot"
            className="mx-auto h-64 w-64"
          />
          <p className="mb-4">This page doesn't exist!</p>
          <button
            onClick={() => router.push("/")}
            className="btn-primary btn text-white"
          >
            Back to Home
          </button>
        </div>
      </div>
    </>
  );
};

export default FourOhFour;
