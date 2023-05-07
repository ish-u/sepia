import { create } from "zustand";
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
  track: Spotify.Track | undefined;
  togglePlayback: (active: boolean) => void;
  changeTrack: (track: Spotify.Track) => void;
  setQueue: (queue: queue) => void;
  changeDeviceId: (id: string) => void;
  setPlayer: (player: Spotify.Player) => void;
  setUser: (user: SpotifyUser) => void;
}

export const useSepiaStore = create<AppState>()((set, get) => ({
  active: false,
  device_id: "",
  player: undefined,
  id: "",
  user: undefined,
  queue: undefined,
  track: undefined,
  changeDeviceId: (id: string) => set({ device_id: id }),
  changeTrack: (track: Spotify.Track) => set({ track: track }),
  setPlayer: (player: Spotify.Player) =>
    set({
      player: player,
    }),
  setQueue: (queue: queue) => set({ queue: queue }),
  togglePlayback: (active: boolean) =>
    set({
      active: active,
    }),
  setUser: (user: SpotifyUser) =>
    set({
      user: user,
    }),
}));
