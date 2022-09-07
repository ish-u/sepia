import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

const client_id = process.env.SPOTIFY_CLIENT_ID || "";
const client_secret = process.env.SPOTIFY_CLIENT_SECRET || "";
const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
const TOKEN_ENDPOINT = process.env.TOKEN_ENDPOINT;
const scopes =
  "user-read-private user-read-email streaming user-read-email user-read-playback-state user-modify-playback-state user-top-read user-read-recently-played playlist-read-collaborative playlist-modify-public playlist-modify-private"
    .split(" ")
    .join(",");

// function for token rotation
const refreshAccessToken = async (refresh_token: string) => {
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
};

export default NextAuth({
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
        token.expiresAt = Date.now() + account.expires_at * 1000;
      }

      // return the original token till it's valid
      if (Date.now() < token.expiresAt) {
        return token;
      }

      // update token
      const updatedToken = await refreshAccessToken(token.refreshToken);
      if (updatedToken) {
        token.accessToken = updatedToken.access_token;
        token.expiresAt = Date.now() + updatedToken.expires_at * 1000;
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
