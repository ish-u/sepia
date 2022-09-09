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

  const getUserQueue = async () => {
    const res = await fetch("/api/spotify/player/queue");
    const userQueue = (await res.json()).data;
    if (res.status === 200) {
      dispatch({
        type: ActionType.UpdateQueue,
        payload: {
          queue: userQueue,
        },
      });
    }
  };

  useEffect(() => {
    if (state.user === undefined && status === "authenticated") {
      const fetchData = setInterval(() => {
        if (session?.accessToken) {
          getUserQueue();
          getCurrentUser();
        }
      }, 1000);

      () => {
        clearInterval(fetchData);
      };
    }
  }, [status]);
  return (
    <div className="bg-[#FFDCCC]">
      {<NavBar />}
      {children}
      {<Player />}
    </div>
  );
}
