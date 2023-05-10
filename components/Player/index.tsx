"use client";
import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSepiaStore } from "../../store/store";
import FullScreen from "./FullScreen";
import PlayerControls from "./PlayerControls";
import SeekBar from "./SeekBar";
import SideControls from "./SideControls";
import SongInformation from "./SongInformation";

const Player = () => {
  // global state
  const player = useSepiaStore((state) => state.player);
  const device_id = useSepiaStore((state) => state.device_id);
  const setPlayer = useSepiaStore((state) => state.setPlayer);
  const togglePlayback = useSepiaStore((state) => state.togglePlayback);
  const changeTrack = useSepiaStore((state) => state.changeTrack);
  const changeDeviceId = useSepiaStore((state) => state.changeDeviceId);

  // full screen
  const [showFullScreen, setShowFullScreen] = useState(false);

  // cheking the session state for checking Authentication and to get the accessToken
  const { status } = useSession();

  // state to store the currenlty playing track information
  const [track, setTrack] = useState<Spotify.Track>();

  useEffect(() => {
    // Setting up the WebPlayback
    const setup = async () => {
      // Checking if the user is authenticated
      if (status === "authenticated") {
        // Adding the Playback SDK Script to DOM
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);

        // Creating a WebPlayback Device instance to access the SDK
        window.onSpotifyWebPlaybackSDKReady = async () => {
          // Initializing the Player Object
          const player = new window.Spotify.Player({
            name: "sepia",
            getOAuthToken: async (cb) => {
              console.log("CALLBACK");
              const currentSession = await getSession();
              return cb(currentSession?.accessToken as string);
            },
            volume: 0.5,
          });

          // adding the player object to the AppContext
          setPlayer(player);

          // Event Listener for when the player becomes ready
          player.addListener("ready", async ({ device_id }) => {
            // console.log("Ready with Device ID", device_id);
            // adding the created device of to the Appcontext
            changeDeviceId(device_id);
          });

          // Event Listener for when the player is not ready
          player.addListener("not_ready", ({ device_id }) => {
            console.log("Device ID has gone offline", device_id);
          });

          // Event Listner for when the player state changes - duration,track,volume,play,pause...etc.
          player.addListener("player_state_changed", (playerState) => {
            if (!playerState) {
              return;
            }
            // setting the state track to the current playing track
            setTrack(playerState.track_window.current_track);
            changeTrack(playerState.track_window.current_track);
            togglePlayback(!playerState.paused);
          });

          // connecting the player object to Spotify to get a playback
          player.connect();
        };
      }
    };

    if (player === undefined && device_id === "") {
      setup();
    } else {
      console.log("PLAYER EXISTS");
    }
  }, [
    status,
    player,
    device_id,
    changeDeviceId,
    changeTrack,
    setPlayer,
    togglePlayback,
  ]);

  return (
    <>
      {player !== undefined && device_id !== "" && (
        <div className="fixed w-full bottom-0 left-0 bg-slate-700 text-white">
          <div className="m-2">
            <div className="flex justify-end  items-center">
              <div className="md:grow-0 grow md:w-3/12 w-9/12">
                {track && <SongInformation />}
              </div>
              <div className="flex flex-grow flex-col justify-center items-center align-middle">
                <PlayerControls fullscreen={false} />
                <div className="flex-col justify-center hidden md:flex w-5/6">
                  <SeekBar />
                </div>
              </div>
              <div className="w-3/12 hidden md:block">
                <SideControls
                  player={player}
                  setShowFullScreen={setShowFullScreen}
                />
              </div>
            </div>
          </div>
          <FullScreen show={showFullScreen} setShow={setShowFullScreen} />
        </div>
      )}
    </>
  );
};

export default Player;
