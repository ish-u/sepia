export interface AppState {
  active: boolean;
  id: string;
  device_id: string;
  player: Spotify.Player | undefined;
}
