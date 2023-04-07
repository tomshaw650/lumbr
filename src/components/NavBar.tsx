import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { User } from "next-auth";
import type { User as PrismaUser } from "@prisma/client";
import { signOut } from "next-auth/react";
import dynamic from "next/dynamic";
const SwitchTheme = dynamic(() => import("../components/SwitchTheme"), {
  ssr: false,
});

interface Props {
  user: User | PrismaUser | null | undefined;
}

const NavBar: React.FC<Props> = React.memo(({ user }) => {
  return (
    <nav className="navbar flex border-b-2 border-neutral border-opacity-20 py-3">
      <ul className="w-full">
        <li>
          <Link href="/home" className="btn-ghost btn-circle btn ml-2 md:ml-10">
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
        <ul className="mr-5 ml-5 flex gap-x-4 md:ml-20">
          <li className="font-bold hover:font-extrabold md:text-2xl">
            <Link href="/following">Following</Link>
          </li>
          <li className="font-bold hover:font-extrabold md:text-2xl">
            <Link href="/explore">Explore</Link>
          </li>
          {user
            ? user.role === "ADMIN" && (
                <li className="font-bold text-emerald-700 hover:font-extrabold md:text-2xl">
                  <Link href="/admin">Admin</Link>
                </li>
              )
            : null}
        </ul>
        <div className="ml-auto flex justify-end gap-x-5">
          <div className="hidden lg:block">
            <SwitchTheme />
          </div>
          <li className="dropdown-hover dropdown-end dropdown">
            <Link href={user ? `/u/${user.username}` : "/auth/login"}>
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
                  alt="Default profile picture"
                  width="50"
                  height="50"
                  className="btn-ghost btn-circle btn mr-2 md:mr-10"
                />
              )}
            </Link>
            {user && (
              <ul
                tabIndex={0}
                className="dropdown-content menu rounded-box flex w-40 max-w-md items-center bg-white p-2 shadow"
              >
                <li className="flex items-center">
                  <div className="md:hidden">
                    <SwitchTheme />
                  </div>
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
        </div>
      </ul>
    </nav>
  );
});

NavBar.displayName = "NavBar";

export default NavBar;
