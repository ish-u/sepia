import { getSession } from "next-auth/react";
import type { NextApiRequest, NextApiResponse } from "next";
import getAccessToken from "../../../../../lib/accessToken";

const API_ENDPOINT: string = "https://api.spotify.com/v1";

const getTopTracks = async (refresh_token: string, id: string) => {
  const { access_token } = await getAccessToken(refresh_token);
  console.log(`${API_ENDPOINT}/artists/${id}/top-tracks?market=IN`);
  return fetch(`${API_ENDPOINT}/artists/${id}/top-tracks?market=IN`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const session = await getSession({ req });
  console.log(session)
  const accessToken = session?.token.accessToken;
  const response = await getTopTracks(accessToken || "", id as string);
  console.log(response.status);
  const data = await response.json();
  return res.status(200).json(data);
};

export default handler;
