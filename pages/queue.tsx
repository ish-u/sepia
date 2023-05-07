import { useEffect } from "react";
import { Track } from "../components/TrackList";
import { useSepiaStore } from "../store/store";

const Queue = () => {
  const track = useSepiaStore((state) => state.track);
  const queue = useSepiaStore((state) => state.queue);
  const setQueue = useSepiaStore((state) => state.setQueue);

  useEffect(() => {
    const getUserQueue = async () => {
      const res = await fetch("/api/spotify/player/queue");
      const userQueue = (await res.json()).data;
      if (res.status === 200) {
        setQueue(userQueue);
      }
    };

    getUserQueue();
  }, [track]);

  useEffect(() => {}, [track, queue]);

  return (
    <div className="mx-36 p-8">
      <div className="text-4xl">Queue</div>
      <div>
        <div className="text-black/75 font-semibold mt-8 mb-4">Now Playing</div>
        {queue?.currently_playing && (
          <Track
            showArtist={true}
            showIdx={true}
            track={queue.currently_playing}
            key={queue.currently_playing.id}
            idx={1}
          />
        )}
        <div className="text-black/75 font-semibold my-4">Next Up</div>

        {queue &&
          queue?.queue.map((track, idx) => {
            return (
              <Track
                showArtist={true}
                showIdx={true}
                track={track}
                key={track.id}
                idx={idx + 2}
                album={track.album}
              />
            );
          })}
      </div>
    </div>
  );
};

export default Queue;
