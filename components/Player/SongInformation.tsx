import Image from "next/image";
import Link from "next/link";
import { useSepiaStore } from "../../store/store";

const SongInformation = () => {
  const track = useSepiaStore((state) => state.track);

  return (
    <div className="flex justify-start items-center">
      <div className="m-1 flex">
        <Image
          className="object-contain"
          src={(track && track?.album.images[0].url) || ""}
          height={(track && track?.album.images[1].height) || 64}
          width={(track && track?.album.images[1].width) || 64}
          layout="fixed"
          alt="Song Image"
        ></Image>
      </div>
      <div className="m-2 flex flex-col justify-center">
        <div className="font-bold text-lg hover:underline hover:cursor-pointer line-clamp-1">
          <Link href={`/album/${track && track.album.uri.split(":").at(-1)}`}>
            {(track && track?.name) || "..."}
          </Link>
        </div>
        <div className="text-sm ">
          {track &&
            track?.artists?.map((artist, idx) => (
              <Link
                key={artist.name}
                href={`/artist/${artist.uri.split(":").at(-1)}`}
              >
                <span className="hover:underline">
                  <>{artist.name}</>
                </span>
                {idx !== track.artists.length - 1 ? ", " : ""}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SongInformation;
