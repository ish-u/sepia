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
const PlayerControls = ({ fullscreen }: { fullscreen: boolean }) => {
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
      {/* SHUFFLE */}
      <div
        className={fullscreen ? "p-2 flex" : "p-2 hidden md:flex"}
        onClick={async () => {
          await toggleShuffle();
          setShuffle(!shuffle);
        }}
      >
        {shuffle === true && (
          <MdShuffleOn className={fullscreen ? "h-8 w-8" : "h-6 w-6"} />
        )}
        {shuffle === false && (
          <MdShuffle className={fullscreen ? "h-8 w-8" : "h-6 w-6"} />
        )}
      </div>

      {/* PREVIOUS */}
      <div
        className={fullscreen ? "p-2 flex" : "p-2 hidden md:flex"}
        onClick={async () => {
          await state.player?.previousTrack();
        }}
      >
        <MdSkipPrevious className={fullscreen ? "h-8 w-8" : "h-6 w-6"} />
      </div>

      {/* PLAY */}
      <div
        className="hover:cursor-pointer"
        onClick={async () => {
          await state.player?.togglePlay();
        }}
      >
        {!state.active ? (
          <MdPlayCircle className={fullscreen ? "h-20 w-20" : "h-10 w-10"} />
        ) : (
          <MdPauseCircle className={fullscreen ? "h-20 w-20" : "h-10 w-10"} />
        )}
      </div>

      {/* NEXT */}
      <div
        className={fullscreen ? "p-2 flex" : "p-2 hidden md:flex"}
        onClick={async () => {
          await state.player?.nextTrack();
        }}
      >
        <MdSkipNext className={fullscreen ? "h-8 w-8" : "h-6 w-6"} />
      </div>

      {/* REPEAT */}
      <div
        className={fullscreen ? "p-2 flex" : "p-2 hidden md:flex"}
        onClick={async () => {
          await toggleRepeat();
        }}
      >
        {repeat === SpotifyRepeatState.off && (
          <MdRepeat className={fullscreen ? "h-8 w-8" : "h-6 w-6"} />
        )}
        {repeat === SpotifyRepeatState.track && (
          <MdRepeatOneOn className={fullscreen ? "h-8 w-8" : "h-6 w-6"} />
        )}
        {repeat === SpotifyRepeatState.context && (
          <MdRepeatOn className={fullscreen ? "h-8 w-8" : "h-6 w-6"} />
        )}
      </div>
    </div>
  );
};

export default PlayerControls;
