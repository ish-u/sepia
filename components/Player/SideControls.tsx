import { useState } from "react";
import { FiMenu, FiVolume, FiVolume1, FiVolume2 } from "react-icons/fi";
const SideControls = ({ player }: { player: Spotify.Player }) => {
  const [volumne, setVolume] = useState(50);

  const setPlayerVolume = async (value: string) => {
    setVolume(parseInt(value));
    await player.setVolume(parseInt(value) / 100);
  };

  return (
    <div className="flex items-center algin-middle justify-end">
      <div className="p-2">
        <FiMenu className="h-6 w-6" />
      </div>
      <div className="p-2">
        {volumne < 30 && <FiVolume className="w-6 h-6" />}
        {volumne >= 30 && volumne <= 50 && <FiVolume1 className="w-6 h-6" />}
        {volumne > 50 && <FiVolume2 className="w-6 h-6" />}
      </div>
      <input
        className="h-1 rounded-full appearance-none"
        min="0"
        max="100"
        value={volumne}
        onChange={(e) => {
          setPlayerVolume(e.target.value);
        }}
        type="range"
      />
    </div>
  );
};

export default SideControls;
