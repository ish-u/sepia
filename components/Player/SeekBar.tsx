import { useState, useEffect } from "react";

const SeekBar = ({ player }: { player: Spotify.Player }) => {
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const seek = async (pos: number) => {
    await player.seek(pos * 1000);
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
      const current = await player.getCurrentState();
      const songDuration: number =
        (current?.track_window.current_track.duration_ms as number) / 1000;
      setPosition((current?.position as number) / 1000);
      setDuration(songDuration);
    }, 100);

    return () => {
      clearInterval(currentPosition);
    };
  }, []);
  return (
    <div className="flex justify-center items-center">
      {/* <div>{`${(position / 60) | 0}:${(position % 60).toFixed(0)}`}</div> */}
      <div>{getFormattedTime(position)}</div>
      <div className="flex flex-grow mx-4">
        <input
          className="h-1 rounded-full appearance-none w-full"
          min="0"
          max={duration}
          value={position}
          onChange={(e) => {
            seek(parseInt(e.target.value));
          }}
          type="range"
        />
      </div>
      <div>{`${(duration / 60) | 0}:${(duration % 60).toFixed(0)}`}</div>
    </div>
  );
};

export default SeekBar;
