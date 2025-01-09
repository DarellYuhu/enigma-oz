import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { FacebookClient } from "./facebook-client";

type Data = {
  token: string;
  user: {
    id: string;
    displayName: string;
    username: string;
    role: string;
  };
};

export const { signIn, signOut, auth, handlers } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(request) {
        const { data }: { data: Data } = await FacebookClient.post(
          "/auth/sign-in",
          request
        );
        return data;
      },
    }),
  ],
  // callbacks: {
  //   authorized: async ({ auth }) => {
  //     // Logged in users are authenticated, otherwise redirect to login page
  //     return !!auth;
  //   },
  //   session: async ({ session, token }) => {
  //     // @ts-ignore
  //     session.user = token.user;
  //     return session;
  //   },
  //   jwt: async ({ token, user }) => {
  //     if (user) {
  //       token.user = user;
  //     }
  //     return token;
  //   },
  // },
});
