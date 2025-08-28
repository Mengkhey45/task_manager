import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

// Minimal authOptions to satisfy getServerSession(authOptions) imports across API routes.
// This project primarily uses Supabase for authentication flows, so this file provides
// a lightweight NextAuth configuration compatible with the existing imports.

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma as any),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize() {
        // We don't use NextAuth credentials for sign-in in this project.
        // Returning null forces credentials sign-in to fail, but getServerSession
        // will work when sessions exist (e.g., created via NextAuth elsewhere).
        return null;
      },
    }),
  ],
  session: {
    strategy: "database",
  },
  callbacks: {
    async session({ session, user }) {
      // Attach user id from adapter for convenience
      return { ...session, user: { ...session.user, id: String((user as any)?.id ?? session.user?.id) } } as any;
    },
  },
};

export default authOptions;
