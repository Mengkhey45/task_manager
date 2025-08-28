import bcrypt from "bcryptjs";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // 1. Return null if missing fields
        if (!credentials?.email || !credentials?.password) return null;

        // 2. Find user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null; // return null if user not found

        // 3. Check password
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null; // return null if invalid

        // 4. Return user object
        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  // next-auth config
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token?.id) session.user = { ...session.user, id: token.id as string };
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin", // match your signin page
  },
};

const handler = NextAuth(authOptions);

// Only export the handlers, not the configuration
// Only export the handlers, not the configuration
export { handler as GET, handler as POST, authOptions };

