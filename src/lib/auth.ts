import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        identifier: {
          label: "Email or username",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const identifier = credentials?.identifier?.trim();
        const password = credentials?.password;

        if (!identifier || !password) {
          return null;
        }

        const user = await prisma.user.findFirst({
          where: {
            OR: [{ email: identifier.toLowerCase() }, { username: identifier }],
          },
        });

        if (!user?.passwordHash) {
          return null;
        }

        const passwordMatches = await bcrypt.compare(
          password,
          user.passwordHash,
        );

        if (!passwordMatches) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (
          session.user as typeof session.user & {
            id: string;
            role?: string;
          }
        ).id = token.id as string;

        (
          session.user as typeof session.user & {
            role?: string;
          }
        ).role = token.role as string | undefined;
      }

      return session;
    },
  },
};
