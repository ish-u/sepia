import { SpotifyUser } from "../pages/api/spotify/user/me";

export interface queue {
  currently_playing: SpotifyApi.TrackObjectFull;
  queue: SpotifyApi.TrackObjectFull[];
}

export interface AppState {
  active: boolean;
  id: string;
  device_id: string;
  player: Spotify.Player | undefined;
  user: SpotifyUser | undefined;
  queue: queue | undefined;
}
