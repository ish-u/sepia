export enum ActionType {
  Toggle,
  Change,
  Device,
  Player,
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

export type AppActions = Toggle | Change | Device | Player;
