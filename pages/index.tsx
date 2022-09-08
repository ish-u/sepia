import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Player from "../components/Player/index";
import Search from "../components/Search";
import { useContext, useEffect } from "react";
import { SpotifyUser } from "./api/spotify/user/me";
import { AppContext } from "../context/context";
import { ActionType } from "../context/actions";
import NavBar from "../components/NavBar";

const Home: NextPage = () => {
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
  }, [status]);

  return (
    <div className="w-full h-full flex justify-center bg-red-500">
      <NavBar />
      <Search />
      <Player />
    </div>
  );
};

export default Home;
