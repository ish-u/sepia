import { useContext, useEffect } from "react";
import { Track } from "../components/TrackList";
import { AppContext } from "../context/context";
import { ActionType } from "../context/actions";

const Queue = () => {
  const { state, dispatch } = useContext(AppContext);

  useEffect(() => {
    const getUserQueue = async () => {
      const res = await fetch("/api/spotify/player/queue");
      const userQueue = (await res.json()).data;
      if (res.status === 200) {
        dispatch({
          type: ActionType.UpdateQueue,
          payload: {
            queue: userQueue,
          },
        });
      }
    };

    getUserQueue();
  }, [state.track, dispatch]);

  useEffect(() => {}, [state.track]);

  return (
    <div className="mx-36 p-8">
      <div className="text-4xl">Queue</div>
      <div>
        <div className="text-black/75 font-semibold mt-8 mb-4">Now Playing</div>
        {state.queue?.currently_playing && (
          <Track
            showArtist={true}
            showIdx={true}
            track={state.queue.currently_playing}
            key={state.queue.currently_playing.id}
            idx={1}
          />
        )}
        <div className="text-black/75 font-semibold my-4">Next Up</div>

        {state.queue &&
          state.queue?.queue.map((track, idx) => {
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
