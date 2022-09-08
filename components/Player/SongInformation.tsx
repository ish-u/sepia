import Image from "next/image";

const SongInformation = ({ track }: { track: Spotify.Track }) => {
  return (
    <div className="flex ">
      <div className="m-2 flex">
        <Image
          className="object-cover"
          src={track.album.images[0].url}
          height={track.album.images[1].height || 64}
          width={track.album.images[1].width || 64}
        ></Image>
      </div>
      <div className="m-2 flex flex-col justify-center">
        <div className="font-bold text-xl hover:underline hover:cursor-pointer">
          {track.name}
        </div>
        <div className="text-md">
          {track.artists.map((artist) => artist.name + " ")}
        </div>
      </div>
    </div>
  );
};

export default SongInformation;
