import { useContext, useEffect, useState } from "react";
import { FiPlay, FiClock } from "react-icons/fi";
import { AppContext } from "../context/context";
import Link from "next/link";
import Image from "next/image";

const getFormattedTime = (seconds: number) => {
  return (
    Math.floor(seconds / 60) + ":" + ("0" + Math.floor(seconds % 60)).slice(-2)
  );
};

export const Track = ({
  track,
  idx,
  showIdx,
  showArtist,
  album,
  img,
}: {
  track: SpotifyApi.TrackObjectSimplified;
  idx?: number;
  showIdx: boolean;
  showArtist: boolean;
  album?: SpotifyApi.AlbumObjectSimplified;
  img?: SpotifyApi.ImageObject;
}) => {
  const { state, dispatch } = useContext(AppContext);
  const [showPlay, setShowPlay] = useState(false);

  const playSong = async (id: string) => {
    if (state.device_id) {
      await fetch(
        `/api/spotify/player/toggle?id=${id}&device_id=${state.device_id}`
      );
    }
  };

  return (
    <div
      className="w-full flex  px-4 py-2 m-1 hover:bg-slate-400/50 rounded-md hover:cursor-pointer"
      onMouseEnter={() => {
        setShowPlay(true);
      }}
      onMouseLeave={() => {
        setShowPlay(false);
      }}
    >
      <div
        onClick={() => {
          playSong(track.id);
        }}
        className={`flex items-center text-lg w-12 ${
          !showIdx && img && "mr-4"
        }`}
      >
        {showIdx && (showPlay ? <FiPlay /> : idx ? idx : track.track_number)}
        {!showIdx && img && (
          <div className="flex flex-col justify-center align-middle relative ">
            <Image
              src={img.url}
              height={42}
              width={42}
              objectFit="contain"
              layout="fixed"
            />
            {showPlay && (
              <div className="flex justify-center items-center absolute top-0 left-0 text-2xl bg-black/50 w-[42px] h-[42px] text-white">
                <FiPlay />
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center grow">
        <div className="w-3/6">
          <div className="text-xl font-semibold">{track.name}</div>
          <div className="flex text-md text-black/75">
            {showArtist === true &&
              track.artists.map((artist, idx) => {
                return (
                  <div className="mr-1 p-0" key={artist.id}>
                    <Link
                      className="flex flex-col"
                      href={`/artist/${artist.id}`}
                    >
                      <span className="hover:underline hover:text-black">
                        {artist.name}
                      </span>
                    </Link>
                    <span>{idx !== track.artists.length - 1 ? ", " : ""}</span>
                  </div>
                );
              })}
          </div>
        </div>
        {album && (
          <div className="flex text-lg font-semibold hover:underline items-center mr-12 w-3/6 line-clamp-1">
            <Link href={`/album/${album?.id}`}>{album?.name}</Link>
          </div>
        )}
      </div>

      <div className="flex items-center">
        {getFormattedTime(track.duration_ms / 1000)}
      </div>
    </div>
  );
};

interface TrackListProps {
  tracks: SpotifyApi.TrackObjectFull[];
  showIdx: boolean;
  showArtist: boolean;
  showAlbum: boolean;
}

type Props = TrackListProps;
const TrackList: React.FC<Props> = ({
  tracks,
  showIdx,
  showArtist,
  showAlbum,
}) => {
  return (
    <>
      <div className="px-8 text-black/75 font-thin mt-4">
        <div className="w-full flex px-4 py-2 mx-1">
          <div className="w-12 flex items-center text-lg">#</div>
          <div className="flex flex-col grow">TITLE</div>
          {showAlbum && <div className="flex flex-col grow">ALBUM</div>}
          <div className="flex items-center">
            <FiClock />
          </div>
        </div>
        <hr className="border-black" />
      </div>
      <div className="flex flex-col px-8 py-4">
        {tracks.map((track, idx) => (
          <Track
            track={track}
            key={track.uri}
            showArtist={showArtist}
            showIdx={showIdx}
            album={showAlbum ? track?.album : undefined}
            idx={idx}
          />
        ))}
      </div>
    </>
  );
};

export default TrackList;
