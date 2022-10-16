import { useEffect, useContext, useState, useRef } from "react";
import { AppContext } from "../../context/context";
import { ActionType } from "../../context/actions";
import { getSession, useSession } from "next-auth/react";
import PlayerControls from "./PlayerControls";
import SeekBar from "./SeekBar";
import SideControls from "./SideControls";
import SongInformation from "./SongInformation";
import FullScreen from "./FullScreen";

const Player = () => {
  // full screen
  const [showFullScreen, setShowFullScreen] = useState(false);

  // getting the AppState from the AppContext
  const { state, dispatch } = useContext(AppContext);

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
          dispatch({ type: ActionType.Player, payload: { player: player } });

          // Event Listener for when the player becomes ready
          player.addListener("ready", async ({ device_id }) => {
            // console.log("Ready with Device ID", device_id);
            // adding the created device of to the Appcontext
            dispatch({ type: ActionType.Device, payload: { device_id } });
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
            dispatch({
              type: ActionType.SetTrack,
              payload: {
                track: playerState.track_window.current_track,
              },
            });
            // dispatching toggle event to AppContext
            dispatch({
              type: ActionType.Toggle,
              payload: {
                active: !playerState.paused,
              },
            });
          });

          // connecting the player object to Spotify to get a playback
          player.connect();
        };
      }
    };

    if (state.player === undefined && state.device_id === "") {
      setup();
    } else {
      console.log("PLAYER EXISTS");
    }
  }, [status, state.player, state.device_id, dispatch]);

  return (
    <>
      {state.player !== undefined && state.device_id !== "" && (
        <div className="fixed w-full bottom-0 left-0 bg-slate-700 text-white">
          <div className="m-2">
            <div className="flex justify-end  items-center">
              <div className="md:grow-0 grow md:w-3/12 w-9/12">
                {state.track && <SongInformation />}
              </div>
              <div className="flex flex-grow flex-col justify-center items-center align-middle">
                <PlayerControls fullscreen={false} />
                <div className="flex-col justify-center hidden md:flex w-5/6">
                  <SeekBar player={state.player} />
                </div>
              </div>
              <div className="w-3/12 hidden md:block">
                <SideControls
                  player={state.player}
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
