import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { AppContext } from "../../context/context";

const SongInformation = () => {
  const { state } = useContext(AppContext);

  return (
    <div className="flex justify-start items-center">
      <div className="m-1 flex">
        <Image
          className="object-contain"
          src={(state.track && state.track?.album.images[0].url) || ""}
          height={(state.track && state.track?.album.images[1].height) || 64}
          width={(state.track && state.track?.album.images[1].width) || 64}
          layout="fixed"
          alt="Song Image"
        ></Image>
      </div>
      <div className="m-2 flex flex-col justify-center">
        <div className="font-bold text-lg hover:underline hover:cursor-pointer line-clamp-1">
          <Link
            href={`/album/${
              state.track && state.track.album.uri.split(":").at(-1)
            }`}
          >
            {(state.track && state.track?.name) || "..."}
          </Link>
        </div>
        <div className="text-sm hover:underline">
          {state.track &&
            state.track?.artists?.map((artist) => (
              <Link
                key={artist.name}
                href={`/artist/${artist.uri.split(":").at(-1)}`}
              >
                {artist.name + " "}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SongInformation;
