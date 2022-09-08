import Image from "next/image";

const SongInformation = ({ track }: { track: Spotify.Track }) => {
  return (
    <div className="flex justify-start items-center">
      <div className="m-1 flex">
        <Image
          className="object-contain"
          src={track?.album.images[0].url || ""}
          height={track?.album.images[1].height || 64}
          width={track?.album.images[1].width || 64}
        ></Image>
      </div>
      <div className="m-2 flex flex-col justify-center">
        <div className="font-bold text-lg hover:underline hover:cursor-pointer">
          {track?.name}
        </div>
        <div className="text-sm ">
          {track?.artists?.map((artist) => artist.name + " ")}
        </div>
      </div>
    </div>
  );
};

export default SongInformation;
