import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiPlay } from "react-icons/fi";

const Play = ({ show }: { show: boolean }) => {
  return (
    <div
      className={`${
        show ? "flex" : "hidden"
      } rounded-full absolute p-4 text-2xl bg-neutral-500 w-fit right-4 bottom-4 animate-appear`}
    >
      <FiPlay />
    </div>
  );
};

export const SearchCard = ({
  title,
  subtitle,
  img,
  rounded,
  type,
  id,
}: {
  title: string;
  subtitle: string;
  img: SpotifyApi.ImageObject;
  rounded: boolean;
  type: "album" | "playlist" | "artist";
  id: string;
}) => {
  const [onHover, setOnHover] = useState(false);

  return (
    <Link href={`/${type}/${id}`}>
      <div
        onMouseEnter={() => {
          setOnHover(true);
        }}
        onMouseLeave={() => {
          setOnHover(false);
        }}
        className="w-1/6 max-h-96 flex flex-col items-center m-2 mr-6 p-2  bg-slate-400 hover:bg-slate-500  duration-300 text-white rounded-xl overflow-hidden"
      >
        <div className="px-4 py-1 pt-4 relative">
          <Image
            className={rounded ? "rounded-full" : "rounded-md"}
            src={
              img?.url ||
              "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bGVuc3xlbnwwfHwwfHw%3D&w=1000&q=80"
            }
            height={img?.height || 144}
            layout="intrinsic"
            objectFit="cover"
            width={img?.width || 144}
          />
          <Play show={onHover} />
        </div>
        <div className="flex flex-col  w-full px-4 py-2">
          <div className="text-lg text-ellipsis overflow-hidden line-clamp-1">
            {title}
          </div>
          <div className="text-sm line-clamp-1 text-white/50">{subtitle}</div>
        </div>
      </div>
    </Link>
  );
};

export default SearchCard;
