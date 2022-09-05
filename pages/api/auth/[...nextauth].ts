import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

const scopes =
  "user-read-private user-read-email streaming user-read-email user-read-playback-state user-modify-playback-state user-top-read user-read-recently-played playlist-read-collaborative playlist-modify-public playlist-modify-private"
    .split(" ")
    .join(",");

export default NextAuth({
  providers: [
    SpotifyProvider({
      authorization: `https://accounts.spotify.com/authorize?scope=${scopes}`,
      clientId: process.env.SPOTIFY_CLIENT_ID || "",
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        console.log(account);
        token.accessToken = account.refresh_token;
      }
      return token;
    },
    async session({ session, token, user }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
});
