import { ReactElement } from "react";
import NavBar from "./NavBar";
import Player from "./Player";
import { useSession } from "next-auth/react";
import { useContext, useEffect } from "react";
import { SpotifyUser } from "../pages/api/spotify/user/me";
import { AppContext } from "../context/context";
import { ActionType } from "../context/actions";

export default function Layout({ children }: { children: ReactElement }) {
  const { status } = useSession();
  const { state, dispatch } = useContext(AppContext);

  useEffect(() => {
    const getCurrentUser = async () => {
      const response = await fetch("/api/spotify/user/me");
      if (response.status === 200) {
        const currentUser: SpotifyUser = await response.json();
        dispatch({ type: ActionType.SetUser, payload: { user: currentUser } });
      }
    };
    if (state.user === undefined && status === "authenticated") {
      getCurrentUser();
    }
  }, [state.user, status, dispatch]);

  return (
    <>
      <div className="fixed top-0 left-0 h-full w-full -z-50  bg-gradient-to-b from-[#FFDCCC] to-slate-400"></div>
      <NavBar />
      {children}
      <Player />
    </>
  );
}
