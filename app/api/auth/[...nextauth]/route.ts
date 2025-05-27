import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/utils/db";

// Configure NextAuth options
const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email,
          },
        });

        if (user && await bcrypt.compare(credentials.password, user.password!)) {
          return user;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }: any) {
      if (account?.provider === "credentials") {
        return true;
      }
      return false;
    },
  },
};

// Create handler using NextAuth
const handler = NextAuth(authOptions);

// Export handlers for App Router
export { handler as GET, handler as POST };
