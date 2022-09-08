import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/context";
import {
  FiPlay,
  FiPause,
  FiSkipBack,
  FiSkipForward,
  FiRepeat,
  FiShuffle,
} from "react-icons/fi";
import { SpotifyRepeatState } from "../../pages/api/spotify/player/repeat";
const PlayerControls = () => {
  const { state, dispatch } = useContext(AppContext);

  // SHUFFLE
  const [shuffle, setShuffle] = useState(false);
  const getShuffleState = async () => {
    const shuffle = (await state.player?.getCurrentState())?.shuffle;
    setShuffle(shuffle || false);
  };

  const toggleShuffle = async () => {
    const shuffle =
      (await state.player?.getCurrentState())?.shuffle === true
        ? "false"
        : "true";
    const resposne = await fetch(
      `/api/spotify/player/shuffle?shuffle=${shuffle}&device_id=${state.device_id}`
    );
  };

  // REPEAT
  const [repeat, setRepeat] = useState<SpotifyRepeatState>(
    SpotifyRepeatState.off
  );
  const getRepeatState = async () => {
    const repeatState = (await state.player?.getCurrentState())?.repeat_mode;
    switch (repeatState) {
      case 0:
        setRepeat(SpotifyRepeatState.off);
        break;
      case 1:
        setRepeat(SpotifyRepeatState.track);
        break;
      case 2:
        setRepeat(SpotifyRepeatState.context);
        break;
      default:
        setRepeat(SpotifyRepeatState.off);
        break;
    }
  };
  const toggleRepeat = async () => {
    const resposne = await fetch(
      `/api/spotify/player/repeat?repeat=${repeat}&device_id=${state.device_id}`
    );
    setRepeat((await resposne.json())?.repeat || SpotifyRepeatState.off);
  };

  useEffect(() => {
    getShuffleState();
    getRepeatState();
  }, []);

  return (
    <div className="flex justify-center align-middle items-center m-1">
      <div
        className="p-2"
        onClick={async () => {
          await toggleRepeat();
        }}
      >
        {repeat === SpotifyRepeatState.off && <FiRepeat className="w-4 h-4" />}
        {repeat === SpotifyRepeatState.track && (
          <FiRepeat className="w-4 h-4 bg-green-400" />
        )}
        {repeat === SpotifyRepeatState.context && (
          <FiRepeat className="w-4 h-4 bg-red-400" />
        )}
      </div>
      <div
        className="p-2"
        onClick={async () => {
          await state.player?.previousTrack();
        }}
      >
        <FiSkipBack className="h-6 w-6" />
      </div>
      <div
        className="p-2 hover:cursor-pointer"
        onClick={async () => {
          await state.player?.togglePlay();
        }}
      >
        {!state.active ? (
          <FiPlay className="h-8 w-8" />
        ) : (
          <FiPause className="h-8 w-8" />
        )}
      </div>

      <div
        className="p-2"
        onClick={async () => {
          await state.player?.nextTrack();
        }}
      >
        <FiSkipForward className="h-6 w-6" />
      </div>
      <div
        className="p-2"
        onClick={async () => {
          await toggleShuffle();
          setShuffle(!shuffle);
        }}
      >
        {shuffle === true && <FiShuffle className="w-4 h-4 text-white" />}
        {shuffle === false && <FiShuffle className="w-4 h-4" />}
      </div>
    </div>
  );
};

export default PlayerControls;
