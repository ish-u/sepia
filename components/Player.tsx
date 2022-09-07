import { useEffect, useContext } from "react";
import { AppContext } from "../context/context";
import { ActionType } from "../context/actions";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

const Player = () => {
  const { state, dispatch } = useContext(AppContext);
  const { data: session, status } = useSession();

  const setup = async () => {
    if (status === "authenticated") {
      // Adding the Playback SDK to DOM
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      document.body.appendChild(script);

      window.onSpotifyWebPlaybackSDKReady = async () => {
        // Getting the Access Token
        console.log(session.accessToken);
        // Initializing the Player Object on the window Object
        const player = new window.Spotify.Player({
          name: "sepia",
          getOAuthToken: (cb) => {
            cb(session.accessToken as string);
          },
          volume: 0.3,
        });

        // adding the player object to the AppContext
        dispatch({ type: ActionType.Player, payload: { player: player } });

        // Event Listener for the player object
        player.addListener("ready", async ({ device_id }) => {
          console.log("Ready with Device ID", device_id);
          dispatch({ type: ActionType.Device, payload: { device_id } });
        });

        player.addListener("not_ready", ({ device_id }) => {
          console.log("Device ID has gone offline", device_id);
        });

        player.addListener("player_state_changed", (playerState) => {
          if (!playerState) {
            return;
          }

          dispatch({
            type: ActionType.Toggle,
            payload: {
              active: !playerState.paused,
            },
          });
        });

        // connecting the player object to Spotify to get a
        player.connect();
      };
    }
  };

  useEffect(() => {
    setup();
  }, [status]);

  return (
    <div className="absolute top-2 right-4">
      {state.player !== undefined && state.device_id !== "" && (
        <button
          className="btn-spotify"
          onClick={async () => {
            state.player?.togglePlay();
          }}
        >
          {!state.active ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 "
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 "
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      )}
      {state.player === undefined && state.device_id === "" && (
        <>
          <Link href="/api/auth/login">
            <div className="hover:cursor-pointer drop-shadow-xl text-white text-lg flex flex-row items-center justify-center align-middle px-4 py-2 my-2 bg-black rounded-full">
              <Image
                height="32px"
                width="32px"
                src="/Spotify_Icon_RGB_Green.png"
                alt="Spotify Logo"
              ></Image>
              <span className="font-thin ml-2">Login on Spotify</span>
            </div>
          </Link>
        </>
      )}
    </div>
  );
};

export default Player;
