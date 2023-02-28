import React from "react";
import Link from "next/link";
import Image from "next/image";
import { User } from "@prisma/client";
import { signOut } from "next-auth/react";
import SwitchTheme from "./SwitchTheme";

interface Props {
  user: User | null | undefined;
}

const NavBar: React.FC<Props> = React.memo(({ user }) => {
  return (
    <nav className="navbar flex border-b-2 border-neutral border-opacity-20 py-3">
      <ul className="w-full">
        <li>
          <Link href="/" className="btn-ghost btn-circle btn ml-2 md:ml-10">
            <Image
              priority={true}
              src="/lumbr.png"
              alt="Lumbr logo"
              width="100"
              height="100"
            />
          </Link>
        </li>
        <li>
          <input
            type="text"
            placeholder="Search..."
            className="input-bordered input ml-2 w-full bg-white focus:pr-40"
          />
        </li>
        <div className="mr-5 ml-5 flex gap-x-4 md:ml-20">
          <li className="font-bold hover:font-extrabold md:text-2xl">
            <Link href="/following">Following</Link>
          </li>
          <li className="font-bold hover:font-extrabold md:text-2xl">
            <Link href="/explore">Explore</Link>
          </li>
        </div>
        <li className="dropdown dropdown-end dropdown-hover ml-auto justify-end">
          <Link href={user ? `/u/${user.id}` : "/auth/login"}>
            {user ? (
              <Image
                priority={true}
                src={user.image!}
                alt="Your profile picture"
                width="50"
                height="50"
                className="btn-ghost btn-circle btn mr-2 md:mr-10"
              />
            ) : (
              <Image
                priority={true}
                src="/user.png"
                alt="Your profile picture"
                width="50"
                height="50"
                className="btn-ghost btn-circle btn mr-2 md:mr-10"
              />
            )}
          </Link>
          {user && (
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box flex w-52 items-center bg-white p-2 shadow"
            >
              <SwitchTheme />
              <li>
                <button
                  onClick={() => {
                    signOut();
                  }}
                  className="btn-primary btn-md btn mt-2 text-white"
                >
                  Logout
                </button>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
});

export default NavBar;
