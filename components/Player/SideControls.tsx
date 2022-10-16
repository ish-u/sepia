import Link from "next/link";
import { useContext, useState } from "react";
import {
  MdQueueMusic,
  MdVolumeDown,
  MdVolumeUp,
  MdVolumeMute,
  MdOpenInFull,
} from "react-icons/md";
import { AppContext } from "../../context/context";

const SideControls = ({
  player,
  setShowFullScreen,
}: {
  player: Spotify.Player;
  setShowFullScreen: (value: boolean) => void;
}) => {
  const [volumne, setVolume] = useState(50);
  const { state } = useContext(AppContext);
  const setPlayerVolume = async (value: string) => {
    setVolume(parseInt(value));
    await player.setVolume(parseInt(value) / 100);
  };

  return (
    <div className="flex items-center algin-middle justify-end">
      <div className="p-1 m-1">
        <Link href="/queue" passHref>
          <div>
            <MdQueueMusic className="h-6 w-6" />
          </div>
        </Link>
      </div>
      <div className="p-1 m-1">
        {volumne <= 0 && <MdVolumeMute className="w-6 h-6" />}
        {volumne > 0 && volumne <= 50 && <MdVolumeDown className="w-6 h-6" />}
        {volumne > 50 && <MdVolumeUp className="w-6 h-6" />}
      </div>
      <input
        className="h-1"
        min="0"
        max="100"
        value={volumne}
        onChange={(e) => {
          setPlayerVolume(e.target.value);
        }}
        type="range"
      />
      <div
        className="p-1 m-1"
        onClick={() => {
          if (state.track !== undefined) {
            setShowFullScreen(true);
          }
        }}
      >
        <MdOpenInFull className="h-6 w-6 " />
      </div>
    </div>
  );
};

export default SideControls;
