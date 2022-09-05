import getAccessToken from "../accessToken";
const PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/me/playlists";

export const getUsersPlaylists = async (refresh_token: string) => {
  const { access_token } = await getAccessToken(refresh_token);
  return fetch(PLAYLISTS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};
