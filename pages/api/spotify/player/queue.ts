import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
const API_ENDPOINT: string = "https://api.spotify.com/v1";

const getQueue = async (access_token: string) => {
  const res = await fetch(`${API_ENDPOINT}/me/player/queue`);
  return res.json();
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  const access_token = session?.accessToken || "";
  const response = await getQueue(access_token);
  return res.status(response).send({ response });
};

export default handler;
