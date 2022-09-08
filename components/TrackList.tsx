import { useContext, useEffect, useState } from "react";
import { FiPlay, FiClock } from "react-icons/fi";
import { AppContext } from "../context/context";
import { ActionType } from "../context/actions";

const getFormattedTime = (seconds: number) => {
  return (
    Math.floor(seconds / 60) + ":" + ("0" + Math.floor(seconds % 60)).slice(-2)
  );
};

const Track = ({ track }: { track: SpotifyApi.TrackObjectSimplified }) => {
  const { state, dispatch } = useContext(AppContext);
  const [showPlay, setShowPlay] = useState(false);

  const playSong = async (id: string) => {
    await fetch(
      `/api/spotify/player/toggle?id=${id}&device_id=${state.device_id}`
    );
  };

  return (
    <div
      className="w-full flex px-4 py-2 m-1 hover:bg-slate-400/50 rounded-md hover:cursor-pointer"
      onMouseEnter={() => {
        setShowPlay(true);
      }}
      onMouseLeave={() => {
        setShowPlay(false);
      }}
      onClick={() => {
        playSong(track.id);
      }}
    >
      <div className="flex items-center text-lg w-12">
        {showPlay ? <FiPlay /> : track.track_number}
      </div>
      <div className="flex flex-col grow">
        <div className="text-xl font-semibold">{track.name}</div>
        <div className="text-md text-black/75">
          {track.artists.map((artist) => artist.name + "")}
        </div>
      </div>
      <div className="flex items-center">
        {getFormattedTime(track.duration_ms / 1000)}
      </div>
    </div>
  );
};

const TrackList = ({
  tracks,
}: {
  tracks: SpotifyApi.TrackObjectSimplified[];
}) => {
  return (
    <>
      <div className="px-8 text-black/75 font-thin mt-4">
        <div className="w-full flex px-4 py-2 mx-1">
          <div className="w-12 flex items-center text-lg">#</div>
          <div className="flex flex-col grow">TITLE</div>
          <div className="flex items-center">
            <FiClock />
          </div>
        </div>
        <hr className="border-black" />
      </div>
      <div className="flex flex-col px-8 py-4">
        {tracks.map((track, idx) => (
          <Track track={track} key={track.uri} />
        ))}
      </div>
    </>
  );
};

export default TrackList;
