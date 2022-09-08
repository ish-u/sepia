import { getSession } from "next-auth/react";
import type { NextApiRequest, NextApiResponse } from "next";

const API_ENDPOINT: string = "https://api.spotify.com/v1";

export interface SpotifyUser {
  country: string;
  display_name: string;
  email: string;
  explicit_content: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
  external_urls: {
    spotify: string | null;
  };
  followers: {
    href: string | null;
    total: number;
  };
  href: string;
  id: "6sgvw84ghr0r9oegtq48dszqu";
  images: [
    {
      height: null | number;
      url: string;
      width: null | number;
    }
  ];
  product: "premium" | "free";
  type: string;
  uri: string;
}

const getCurrentUser = async (access_token: string) => {
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
  if (response.status === 200) {
    const data: SpotifyUser = await response.json();
    return res.status(200).json(data);
  }
  return res.status(response.status).send({});
};

export default handler;
