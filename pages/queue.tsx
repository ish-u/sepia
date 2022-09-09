import { useSession } from "next-auth/react";
import React, { useContext, useEffect, useState } from "react";
import { Track } from "../components/TrackList";
import { AppContext } from "../context/context";
import { getUserQueue } from "../library/spotify";
const API_ENDPOINT: string = "https://api.spotify.com/v1";

const Queue = () => {
  const { data: session } = useSession();
  const { state, dispatch } = useContext(AppContext);

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
