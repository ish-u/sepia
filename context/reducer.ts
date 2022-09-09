import { AppActions } from "./actions";
import { ActionType } from "./actions";
import { AppState } from "./state";

export const AppReducer = (state: AppState, action: AppActions): AppState => {
  switch (action.type) {
    case ActionType.Toggle:
      return { ...state, active: action.payload.active };
    case ActionType.Change:
      return { ...state, id: action.payload.id };
    case ActionType.Device:
      return { ...state, device_id: action.payload.device_id };
    case ActionType.Player:
      return { ...state, player: action.payload.player };
    case ActionType.SetUser:
      return { ...state, user: action.payload.user };
    case ActionType.UpdateQueue:
      return { ...state, queue: action.payload.queue };

    default:
      return state;
  }
};
