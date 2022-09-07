import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

const playSong = async (
  id: string,
  access_token: string,
  device_id: string
) => {
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application.json",
      Authorization: "Bearer " + access_token,
      Accept: "application/json",
    },
    body: JSON.stringify({
      uris: [`spotify:track:${id}`],
    } as any),
  };
  const res = await fetch(
    `https://api.spotify.com/v1/me/player/play?device_id=${device_id}`,
    options
  );
  return res.json();
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query, method } = req;
  const session = await getSession({ req });
  const { id, device_id } = query;
  const access_token = session?.accessToken || "";

  const response = await playSong(
    id as string,
    access_token,
    device_id as string
  );
  return res.status(200).json(response);
};

export default handler;
