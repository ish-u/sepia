const API_ENDPOINT: string = "https://api.spotify.com/v1";
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

export const getServerAccessToken = async () => {
  // fetch access token
  const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
  var tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + basic,
      Accept: "application/json",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }).toString(),
  });

  // access token for query
  const token = (await tokenResponse.json())?.access_token;

  return token;
};

export const getUserQueue = async (access_token: string) => {
  const data = await fetch(`${API_ENDPOINT}/me/player/queue`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  const res = await data.json();
  return res;
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

// PLAYLIST
// ===================================================================================
export const getPlaylist = async (id: string, access_token: string) => {
  const res = await fetch(
    `${API_ENDPOINT}/playlists/${id}?fields=id,owner(display_name),name,images,tracks(limit,total),snapshot_id`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  const data = await res.json();
  return data;
};

export const getPlaylistTracks = async (
  id: string,
  offset: number,
  access_token: string
) => {
  const res = await fetch(
    `${API_ENDPOINT}/playlists/${id}/tracks?offset=${offset}&fields=items(track(id,name,duration_ms,artists(name,id),album(name,id)))`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  const data = await res.json();
  return data;
};

export const isPlaylistLiked = async (
  access_token: string,
  user_id: string,
  playlist_id: string
) => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application.json",
      Authorization: "Bearer " + access_token,
      Accept: "application/json",
    },
  };
  const res = await fetch(
    `${API_ENDPOINT}/playlists/${playlist_id}/followers/contains?ids=${user_id}`,
    options
  );
  const data = await res.json();
  return data;
};

export const likePlaylist = async (
  access_token: string,
  playlist_id: string
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
    `${API_ENDPOINT}/playlists/${playlist_id}/followers`,
    options
  );
  return res.status;
};

export const unlikePlaylist = async (
  access_token: string,
  playlist_id: string
) => {
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application.json",
      Authorization: "Bearer " + access_token,
      Accept: "application/json",
    },
  };
  const res = await fetch(
    `${API_ENDPOINT}/playlists/${playlist_id}/followers`,

    options
  );
  return res.status;
};

// ===================================================================================

// ALBUM
// ===================================================================================
export const getAlbum = async (access_token: string, id: string) => {
  const res = await fetch(`${API_ENDPOINT}/albums/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  });
  const data = await res.json();
  console.log(data.error);
  if (data?.error?.status === 400) {
    throw new Error("ALBUM DOES NOT EXISTS");
  }
  return data;
};

export const getArtistAlbum = async (access_token: string, id: string) => {
  const res = await fetch(
    `${API_ENDPOINT}/artists/${id}/albums?limit=50&include_groups=album,single`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  const data = await res.json();
  return data;
};

export const isAlbumLiked = async (access_token: string, id: string) => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application.json",
      Authorization: "Bearer " + access_token,
      Accept: "application/json",
    },
  };
  const res = await fetch(
    `${API_ENDPOINT}/me/albums/contains?ids=${id}`,
    options
  );
  const data = await res.json();
  return data;
};

export const likeAlbum = async (access_token: string, id: string) => {
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application.json",
      Authorization: "Bearer " + access_token,
      Accept: "application/json",
    },
  };
  const res = await fetch(`${API_ENDPOINT}/me/albums?ids=${id}`, options);
  return res.status;
};

export const unlikeAlbum = async (access_token: string, id: string) => {
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application.json",
      Authorization: "Bearer " + access_token,
      Accept: "application/json",
    },
  };
  const res = await fetch(`${API_ENDPOINT}/me/albums?ids=${id}`, options);
  return res.status;
};
// ===================================================================================

// TRACK
export const getTopTracks = async (access_token: string, id: string) => {
  const res = await fetch(
    `${API_ENDPOINT}/artists/${id}/top-tracks?market=IN`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  const data = await res.json();
  return data;
};

// ARTISTS
// ===================================================================================
export const getArtist = async (access_token: string, id: string) => {
  const res = await fetch(`${API_ENDPOINT}/artists/${id}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  const data = await res.json();
  return data;
};

// FOLLOW, UNFOLLOW, CHECK FOLLOWING ARTIST
export const checkFollowing = async (id: string, access_token: string) => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application.json",
      Authorization: "Bearer " + access_token,
      Accept: "application/json",
    },
  };
  const res = await fetch(
    `${API_ENDPOINT}/me/following/contains?type=artist&ids=${id}`,
    options
  );
  const data = await res.json();
  return data;
};

export const followArtist = async (id: string, access_token: string) => {
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application.json",
      Authorization: "Bearer " + access_token,
      Accept: "application/json",
    },
  };
  const res = await fetch(
    `${API_ENDPOINT}/me/following?type=artist&ids=${id}`,
    options
  );
  return res.status;
};

export const unfollowArtist = async (id: string, access_token: string) => {
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application.json",
      Authorization: "Bearer " + access_token,
      Accept: "application/json",
    },
  };
  const res = await fetch(
    `${API_ENDPOINT}/me/following?type=artist&ids=${id}`,
    options
  );
  return res.status;
};
// ===================================================================================
