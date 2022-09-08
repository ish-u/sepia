import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
const API_ENDPOINT: string = "https://api.spotify.com/v1";

export enum SpotifyRepeatState {
  track = "track",
  context = "context",
  off = "off",
}

const getSpotifyRepeatState = (state: string): string => {
  switch (state) {
    case "off":
      return "track";
    case "track":
      return "context";
    case "context":
      return "off";
    default:
      return "off";
  }
};

const toggleShuffle = async (
  device_id: string,
  access_token: string,
  repeat: string
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
    `${API_ENDPOINT}/me/player/repeat?state=${repeat}&device_id=${device_id}`,
    options
  );
  return res.status;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  const { query } = req;
  const { device_id, repeat } = query;
  const access_token = session?.accessToken || "";
  console.log(repeat, getSpotifyRepeatState(repeat as string));
  const response = await toggleShuffle(
    device_id as string,
    access_token,
    getSpotifyRepeatState(repeat as string)
  );
  return res.status(response).send({
    repeat: getSpotifyRepeatState(repeat as string),
  });
};

export default handler;
