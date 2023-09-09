import { NextAuthOptions } from "next-auth";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { db } from "@/lib/db";
import GoogleProvider from "next-auth/providers/google";

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
  ],
  callbacks: {
    //return object will be treated as token that contain every data needed to be injected in jwt

    async jwt({ token, user }) {
      const dbUser = (await db.get(`user:${token.id}`)) as User | null;

      //if user is not in db then we have to give an id from user.id(user is created to store in db)
      if (!dbUser) {
        return {
          ...token,
          id: user.id,
        };
      }
      //if user exits in db then it will have every thing in db, so we can send all info from db user as token
      return {
        ...dbUser,
      };
    },

    //and here you create and return the session
    async session({ session, token }) {
      if (token) {
        session.user = { ...token };
      }
      return session;
    },
    redirect() {
      return "/dashboard";
    },
  },
};
