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

export const getRecentPlayed = async (access_token: string) => {
  const res = await fetch(`${API_ENDPOINT}/me/player/recently-played`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
      "content-type": "application/json",
    },
  });
  console.log(res.status);
  const data = await res.json();
  return data;
};

export const getUserTopItems = async (
  access_token: string,
  type: "artists" | "tracks"
) => {
  const res = await fetch(`${API_ENDPOINT}/me/top/${type}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
      "content-type": "application/json",
    },
  });
  const data = await res.json();
  return data;
};

export const getUserLikedTracks = async (
  access_token: string,
  offest: number
) => {
  const res = await fetch(
    `${API_ENDPOINT}/me/tracks?limit=50&offset=${offest}`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "content-type": "application/json",
      },
    }
  );
  const data = await res.json();
  return data;
};

export const getUserSavedAlbums = async (
  access_token: string,
  offest: number
) => {
  const res = await fetch(
    `${API_ENDPOINT}/me/albums?limit=50&offset=${offest}`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "content-type": "application/json",
      },
    }
  );
  const data = await res.json();
  return data;
};

export const getUserSavedPlaylists = async (
  access_token: string,
  offest: number
) => {
  const res = await fetch(
    `${API_ENDPOINT}/me/playlists?limit=50&offset=${offest}`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "content-type": "application/json",
      },
    }
  );
  const data = await res.json();
  return data;
};

export const getNewReleases = async (access_token: string) => {
  const res = await fetch(`${API_ENDPOINT}/browse/new-releases`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
      "content-type": "application/json",
    },
  });
  const data = await res.json();
  return data;
};

export const getFeaturedPlaylists = async (access_token: string) => {
  const res = await fetch(`${API_ENDPOINT}/browse/featured-playlists`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
      "content-type": "application/json",
    },
  });
  const data = await res.json();
  return data;
};

export const playAlbumPlaylistArtist = async (
  context_uri: string,
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
      context_uri: context_uri,
    } as any),
  };
  const res = await fetch(
    `https://api.spotify.com/v1/me/player/play?device_id=${device_id}`,
    options
  );
  return res.status;
};
