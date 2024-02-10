import { useEffect, useState } from "react";

import {
  MdPauseCircle,
  MdPlayCircle,
  MdRepeat,
  MdRepeatOn,
  MdRepeatOneOn,
  MdShuffle,
  MdShuffleOn,
  MdSkipNext,
  MdSkipPrevious,
} from "react-icons/md";
import { SpotifyRepeatState } from "../../pages/api/spotify/player/repeat";
import { useSepiaStore } from "../../store/store";
const PlayerControls = ({
  fullscreen,
  style,
}: {
  fullscreen: boolean;
  style?: {};
}) => {
  // const { state, dispatch } = useContext(AppContext);
  const player = useSepiaStore((state) => state.player);
  const device_id = useSepiaStore((state) => state.device_id);
  const active = useSepiaStore((state) => state.active);

  // SHUFFLE
  const [shuffle, setShuffle] = useState(false);
  const getShuffleState = async () => {
    const shuffle = (await player?.getCurrentState())?.shuffle;
    setShuffle(shuffle || false);
  };

  const toggleShuffle = async () => {
    const shuffle =
      (await player?.getCurrentState())?.shuffle === true ? "false" : "true";
    const resposne = await fetch(
      `/api/spotify/player/shuffle?shuffle=${shuffle}&device_id=${device_id}`
    );
  };

  // REPEAT
  const [repeat, setRepeat] = useState<SpotifyRepeatState>(
    SpotifyRepeatState.off
  );
  const getRepeatState = async () => {
    const repeatState = (await player?.getCurrentState())?.repeat_mode;
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
      `/api/spotify/player/repeat?repeat=${repeat}&device_id=${device_id}`
    );
    setRepeat((await resposne.json())?.repeat || SpotifyRepeatState.off);
  };

  useEffect(() => {
    getShuffleState();
    getRepeatState();
  });

  return (
    <div
      className="flex justify-center align-middle items-center m-1"
      style={style}
    >
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
          await player?.previousTrack();
        }}
      >
        <MdSkipPrevious className={fullscreen ? "h-8 w-8" : "h-6 w-6"} />
      </div>

      {/* PLAY */}
      <div
        className="hover:cursor-pointer"
        onClick={async () => {
          await player?.togglePlay();
        }}
      >
        {!active ? (
          <MdPlayCircle className={fullscreen ? "h-20 w-20" : "h-10 w-10"} />
        ) : (
          <MdPauseCircle className={fullscreen ? "h-20 w-20" : "h-10 w-10"} />
        )}
      </div>

      {/* NEXT */}
      <div
        className={fullscreen ? "p-2 flex" : "p-2 hidden md:flex"}
        onClick={async () => {
          await player?.nextTrack();
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
