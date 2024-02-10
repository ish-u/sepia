import { useEffect, useState } from "react";
import { useSepiaStore } from "../../store/store";

const SeekBar = ({ style }: { style?: {} }) => {
  const player = useSepiaStore((state) => state.player);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const seek = async (pos: number) => {
    await player?.seek(pos * 1000);
  };

  const getFormattedTime = (seconds: number) => {
    return (
      Math.floor(seconds / 60) +
      ":" +
      ("0" + Math.floor(seconds % 60)).slice(-2)
    );
  };

  useEffect(() => {
    const currentPosition = setInterval(async () => {
      if (player) {
        const current = await player?.getCurrentState();
        if (!current?.paused) {
          const songDuration: number =
            (current?.track_window.current_track.duration_ms as number) / 1000;
          if (songDuration) {
            setPosition((current?.position as number) / 1000);
            setDuration(songDuration);
          }
        }
      }
    }, 100);

    return () => {
      clearInterval(currentPosition);
    };
  }, [player]);
  return (
    <div className="flex justify-center items-center ">
      <div style={style}>{getFormattedTime(position)}</div>
      <div className="flex flex-grow mx-4 accent-slate-500" style={style}>
        <input
          className="h-1 w-full"
          min="0"
          max={duration}
          value={position}
          onChange={(e) => {
            seek(parseInt(e.target.value));
          }}
          type="range"
        />
      </div>
      <div style={style}>{getFormattedTime(duration)}</div>
    </div>
  );
};

export default SeekBar;
