import { SpotifyUser } from "../pages/api/spotify/user/me";
import { queue } from "./state";
export enum ActionType {
  Toggle,
  Change,
  Device,
  Player,
  SetUser,
  UpdateQueue,
  SetTrack,
}

export interface Toggle {
  type: ActionType.Toggle;
  payload: { active: boolean };
}

export interface Change {
  type: ActionType.Change;
  payload: { id: string };
}

export interface Device {
  type: ActionType.Device;
  payload: { device_id: string };
}

export interface Player {
  type: ActionType.Player;
  payload: { player: Spotify.Player };
}

export interface SetUser {
  type: ActionType.SetUser;
  payload: { user: SpotifyUser };
}

export interface UpdateQueue {
  type: ActionType.UpdateQueue;
  payload: { queue: queue };
}

export interface SetTrack {
  type: ActionType.SetTrack;
  payload: { track: Spotify.Track };
}

export type AppActions =
  | Toggle
  | Change
  | Device
  | Player
  | SetUser
  | UpdateQueue
  | SetTrack;
