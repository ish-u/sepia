const API_ENDPOINT: string = "https://api.spotify.com/v1";

export const getUserQueue = async (access_token: string) => {
  const data = await fetch(`${API_ENDPOINT}/me/player/queue`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  const res = await data.json();
  return res;
};

export const getPlaylist = async (id: string, access_token: string) => {
  const res = await fetch(`${API_ENDPOINT}/playlists/${id}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  const data = await res.json();
  return data;
};
