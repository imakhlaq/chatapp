import { NextAuthOptions } from "next-auth";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { db } from "@/lib/db";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { fetchRedis } from "@/helper/redis";

// Next.js caches the get request, so make a helper function to do http request else you will get weird behavior

export const authOptions: NextAuthOptions = {
  adapter: UpstashRedisAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // for login form u need to return a user if it needs to register else return false to deny
    CredentialsProvider({
      id: "password",
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "john@gmail.com" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, req) => {
        //check in db etc. and perform all checks
        const user = { id: "1", name: "J Smith", email: "test@example.com" };
        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    //return object will be treated as a token that contains every data needed to be injected in jwt

    async jwt({ token, user }) {
      const dbResult = (await fetchRedis("get", `user:${token.id}`)) as
        | string
        | null;

      //if a user is not in db, then we have to give an id from user.id(user is created to store in db)
      if (!dbResult) {
        return {
          ...token,
          id: user.id,
        };
      }

      const dbUser = JSON.parse(dbResult) as User;
      //if user exits in db then it will have everything in db, so we can send all info from db user as token
      return {
        ...dbUser,
      };
    },

    //and here you create and return the session

    //If you want to make something available you added to the token (like access_token and user.id from above) via the jwt() callback, you have to explicitly forward it here to make it available to the client.
    async session({ session, token }) {
      if (token) {
        // Send properties to the client, like user id from a provider.
        session.user = { ...token };
      }
      return session;
    },
    redirect() {
      return "/dashboard";
    },
  },
};
