import Image from "next/image";
import Link from "next/link";

const SongInformation = ({ track }: { track: Spotify.Track }) => {
  return (
    <div className="flex justify-start items-center">
      <div className="m-1 flex">
        <Image
          className="object-contain"
          src={track?.album.images[0].url || ""}
          height={track?.album.images[1].height || 64}
          width={track?.album.images[1].width || 64}
          layout="fixed"
        ></Image>
      </div>
      <div className="m-2 flex flex-col justify-center">
        <div className="font-bold text-lg hover:underline hover:cursor-pointer line-clamp-1">
          <Link href={`/album/${track.album.uri.split(":").at(-1)}`}>
            {track?.name || "SOME SONG"}
          </Link>
        </div>
        <div className="text-sm hover:underline">
          {track?.artists?.map((artist) => (
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
