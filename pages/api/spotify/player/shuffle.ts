import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
const API_ENDPOINT: string = "https://api.spotify.com/v1";

const toggleShuffle = async (
  device_id: string,
  access_token: string,
  shuffle: boolean
) => {
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application.json",
      Authorization: "Bearer " + access_token,
      Accept: "application/json",
    },
  };

  const res = await fetch(
    `${API_ENDPOINT}/me/player/shuffle?state=${shuffle}&device_id=${device_id}`,
    options
  );
  return res.status;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  const { query } = req;
  const { device_id, shuffle } = query;
  const access_token = session?.accessToken || "";
  const response = await toggleShuffle(
    device_id as string,
    access_token,
    shuffle === "true" ? true : false
  );
  return res.status(response).send({});
};

export default handler;
