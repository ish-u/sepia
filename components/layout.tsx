import { ReactElement } from "react";
import NavBar from "./NavBar";
import Player from "./Player";
import { useSession } from "next-auth/react";
import { useContext, useEffect } from "react";
import { SpotifyUser } from "../pages/api/spotify/user/me";
import { AppContext } from "../context/context";
import { ActionType } from "../context/actions";

export default function Layout({ children }: { children: ReactElement }) {
  const { data: session, status } = useSession();
  const { state, dispatch } = useContext(AppContext);
  const getCurrentUser = async () => {
    const response = await fetch("/api/spotify/user/me");
    if (response.status === 200) {
      const currentUser: SpotifyUser = await response.json();
      dispatch({ type: ActionType.SetUser, payload: { user: currentUser } });
    }
  };

  useEffect(() => {
    if (state.user === undefined && status === "authenticated") {
      getCurrentUser();
    }
  }, [status, state]);
  return (
    <div className="bg-[#FFDCCC]">
      <NavBar />
      {children}
      <Player />
    </div>
  );
}
