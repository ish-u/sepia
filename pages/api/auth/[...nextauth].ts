import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import prisma from "../../../library/prisma";

const client_id = process.env.SPOTIFY_CLIENT_ID || "";
const client_secret = process.env.SPOTIFY_CLIENT_SECRET || "";
const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
const TOKEN_ENDPOINT = process.env.TOKEN_ENDPOINT;
const scopes = `user-read-private user-read-email streaming user-read-email 
   user-read-playback-state user-modify-playback-state user-top-read
   user-read-recently-played playlist-read-collaborative playlist-modify-public 
   playlist-modify-private user-library-read user-library-modify user-follow-modify user-follow-read`
  .split(" ")
  .join(",");

// function for token rotation
const refreshAccessToken = async (refresh_token: string) => {
  console.log(refresh_token);
  try {
    const response = await fetch(TOKEN_ENDPOINT || "", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token,
      }),
    });

    return response.json();
  } catch (e) {
    console.log(e);
    return "ERROR";
  }
};

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    SpotifyProvider({
      authorization: `https://accounts.spotify.com/authorize?scope=${scopes}`,
      clientId: client_id,
      clientSecret: client_secret,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial Sign In
      if (account && user) {
        token.refreshToken = account.refresh_token;
        token.accessToken = account.access_token;
        token.expiresAt = (account.expires_at as number) * 1000;
        token.userID = account.providerAccountId;
      }

      // return the original token till it's valid
      // console.log(
      //   Date.now(),
      //   token?.expiresAt ? token.expiresAt : 0,
      //   Date.now() < (token?.expiresAt ? token.expiresAt : 0),
      //   token.accessToken
      // );
      if (Date.now() < (token?.expiresAt ? token.expiresAt : 0)) {
        return token;
      }

      // update token
      const updatedToken = await refreshAccessToken(token.refreshToken || "");
      if (updatedToken) {
        token.accessToken = updatedToken.access_token;
        token.expiresAt = Date.now() + updatedToken.expires_in * 1000;
      }
      return token;
    },
    async session({ session, token, user }) {
      session.accessToken = token.accessToken as string;
      session.userID = token.userID;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
});
