import React, { createContext, useReducer, ReactNode } from "react";
import { AppActions } from "./actions";
import { AppReducer } from "./reducer";
import { AppState } from "./state";
const InitialState: AppState = {
  active: false,
  device_id: "",
  player: undefined,
  id: "",
  user: undefined,
};

export const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppActions>;
}>({ state: InitialState, dispatch: () => null });

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(AppReducer, InitialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
