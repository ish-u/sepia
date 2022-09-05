import { getUsersPlaylists } from "../../../lib/handlers/getUserPlaylist";
import { getSession } from "next-auth/react";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log((await getSession({ req }))?.token);
  const session = await getSession({ req });
  const accessToken = session?.token.accessToken;
  const response = await getUsersPlaylists(accessToken || "");
  const { items } = await response.json();

  return res.status(200).json({ items });
};

export default handler;
