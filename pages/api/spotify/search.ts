import type { NextApiRequest, NextApiResponse } from "next";
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { q },
    method,
  } = req;

  if (method === "GET" && q != "") {
    // fetch access token
    var tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + basic,
        Accept: "application/json",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
      }).toString(),
    });

    // access token for query
    const token = (await tokenResponse.json())?.access_token;

    var searchResponse = await fetch(
      `https://api.spotify.com/v1/search?q=${q}&type=track&limit=5`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
          Accept: "application/json",
        },
      }
    );

    const tracks = (await searchResponse.json()).tracks?.items;

    if (tracks) {
      return res.status(200).json({ tracks });
    }
  }
  res.status(200).json({ tracks: [] });
}
