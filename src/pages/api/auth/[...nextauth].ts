import NextAuth, { type NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";

export const authOptions: NextAuthOptions = {
  callbacks: {
    async signIn({ user }) {
      if (user) {
        const suspendedUser = await prisma.user.findUnique({
          where: { email: user.email! },
          select: { suspended: true, suspendReason: true, suspendDate: true },
        });
        if (suspendedUser?.suspended) {
          if (suspendedUser.suspendReason) {
            throw new Error(
              "Your account has been suspended. Reason: " +
                suspendedUser.suspendReason +
                " You will be unsuspended on " +
                suspendedUser.suspendDate
            );
          } else {
            throw new Error(
              "Your account has been suspended. You will be unsuspended on " +
                suspendedUser.suspendDate
            );
          }
        }
      }
      return true;
    },
    session({ session, user }) {
      if (session.user) {
        // store the user id and role in every session
        session.user.id = user.id;
        session.user.role = user.role;
      }
      return session;
    },
  },
  // set adapter to Prisma
  adapter: PrismaAdapter(prisma),
  // set GitHub and Google as providers
  providers: [
    GitHubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    newUser: "/auth/new-user",
    error: "/auth/error",
  },
  debug: true,
};

export default NextAuth(authOptions);
