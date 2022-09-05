import { getSession } from "next-auth/react";
import type { NextApiRequest, NextApiResponse } from "next";
import getAccessToken from "../../../../lib/accessToken";

const API_ENDPOINT: string = "https://api.spotify.com/v1";

const getCurrentUser = async (refresh_token: string) => {
  const { access_token } = await getAccessToken(refresh_token);
  console.log(`${API_ENDPOINT}/me`);
  return fetch(`${API_ENDPOINT}/me`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  const accessToken = session?.accessToken || "";
  const response = await getCurrentUser(accessToken);
  const data = await response.json();
  return res.status(200).json(data);
};

export default handler;
