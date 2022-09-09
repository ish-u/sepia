import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
const API_ENDPOINT: string = "https://api.spotify.com/v1";

export const getUserQueue = async (access_token: string) => {
  return fetch(`${API_ENDPOINT}/me/player/queue`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
      "content-type": "application/json",
    },
  });
  // const res = await data.json();
  // return res;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  const access_token = session?.accessToken || "";
  const response = await getUserQueue(access_token);
  const data = await response.json();
  console.log(response.status);
  return res.status(response.status).send({ data });
};

export default handler;
