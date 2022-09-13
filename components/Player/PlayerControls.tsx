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

import {
  MdPlayCircle,
  MdPauseCircle,
  MdRepeatOn,
  MdRepeat,
  MdShuffle,
  MdShuffleOn,
  MdRepeatOneOn,
  MdSkipNext,
  MdSkipPrevious,
} from "react-icons/md";
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
  });

  return (
    <div className="flex justify-center align-middle items-center m-1">
      <div
        className="p-2"
        onClick={async () => {
          await toggleShuffle();
          setShuffle(!shuffle);
        }}
      >
        {shuffle === true && <MdShuffleOn className="w-6 h-6" />}
        {shuffle === false && <MdShuffle className="w-6 h-6" />}
      </div>
      <div
        className="p-2"
        onClick={async () => {
          await state.player?.previousTrack();
        }}
      >
        <MdSkipPrevious className="h-6 w-6" />
      </div>
      <div
        className="hover:cursor-pointer"
        onClick={async () => {
          await state.player?.togglePlay();
        }}
      >
        {!state.active ? (
          <MdPlayCircle className="h-10 w-10" />
        ) : (
          <MdPauseCircle className="h-10 w-10" />
        )}
      </div>

      <div
        className="p-2"
        onClick={async () => {
          await state.player?.nextTrack();
        }}
      >
        <MdSkipNext className="h-6 w-6" />
      </div>

      <div
        className="p-2"
        onClick={async () => {
          await toggleRepeat();
        }}
      >
        {repeat === SpotifyRepeatState.off && <MdRepeat className="w-6 h-6" />}
        {repeat === SpotifyRepeatState.track && (
          <MdRepeatOneOn className="w-6 h-6" />
        )}
        {repeat === SpotifyRepeatState.context && (
          <MdRepeatOn className="w-6 h-6" />
        )}
      </div>
    </div>
  );
};

export default PlayerControls;
