import { getSession } from "next-auth/react";
import type { NextApiRequest, NextApiResponse } from "next";

const API_ENDPOINT: string = "https://api.spotify.com/v1";

export const getAlbum = async (access_token: string, id: string) => {
  console.log(`${API_ENDPOINT}/albums/${id}`);
  return fetch(`${API_ENDPOINT}/albums/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const session = await getSession({ req });
  const accessToken = session?.accessToken;
  const response = await getAlbum(accessToken || "", id as string);
  const data = await response.json();
  return res.status(200).json({ data });
};

export default handler;
