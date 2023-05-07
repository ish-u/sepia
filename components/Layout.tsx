import { useSession } from "next-auth/react";
import { ReactElement, useEffect } from "react";
import { SpotifyUser } from "../pages/api/spotify/user/me";
import { useSepiaStore } from "../store/store";
import NavBar from "./NavBar";
import Player from "./Player";

export default function Layout({ children }: { children: ReactElement }) {
  const user = useSepiaStore((state) => state.user);
  const setUser = useSepiaStore((state) => state.setUser);
  const { status } = useSession();

  useEffect(() => {
    const getCurrentUser = async () => {
      const response = await fetch("/api/spotify/user/me");
      if (response.status === 200) {
        const currentUser: SpotifyUser = await response.json();
        setUser(currentUser);
      }
    };
    if (user === undefined && status === "authenticated") {
      console.log(status);
      getCurrentUser();
    }
  }, [user, status, setUser]);

  return (
    <div className="max-w-screen-2xl">
      <div className="fixed top-0 left-0 h-full w-full -z-50  bg-gradient-to-b from-[#FFDCCC] to-slate-400"></div>
      {status === "authenticated" && (
        <>
          <NavBar />
          {children}
          <Player />
        </>
      )}
      {status === "unauthenticated" && (
        <>
          {children}
          <Player />
        </>
      )}
    </div>
  );
}
