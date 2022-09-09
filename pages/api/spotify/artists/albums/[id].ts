import { getSession } from "next-auth/react";
import type { NextApiRequest, NextApiResponse } from "next";

const API_ENDPOINT: string = "https://api.spotify.com/v1";

export const getArtistAlbum = async (access_token: string, id: string) => {
  console.log(`${API_ENDPOINT}/artists/${id}/albums `);
  return fetch(
    `${API_ENDPOINT}/artists/${id}/albums?limit=50&include_groups=album,single`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const session = await getSession({ req });
  const accessToken = session?.accessToken;
  const response = await getArtistAlbum(accessToken || "", id as string);
  console.log(response.status);
  const data = await response.json();
  return res.status(200).json(data);
};

export default handler;
