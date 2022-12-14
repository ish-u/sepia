import React, { useContext, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { playAlbumPlaylistArtist } from "../library/spotify";
import { useSession } from "next-auth/react";
import { AppContext } from "../context/context";
import { MdPlayArrow } from "react-icons/md";
import fallbackURL from "../public/fallback.jpg";

export const Play = ({ show, uri }: { show: boolean; uri?: string }) => {
  const { data: session } = useSession();
  const { state } = useContext(AppContext);
  return (
    <div
      className={`${
        show ? "flex" : "hidden"
      } rounded-full  p-4 text-3xl bg-neutral-500 hover:cursor-pointer w-fit animate-appear`}
      onClick={async (e) => {
        e.stopPropagation();
        if (session?.accessToken && uri) {
          await playAlbumPlaylistArtist(
            uri,
            session?.accessToken,
            state.device_id
          );
        }
      }}
    >
      <MdPlayArrow />
    </div>
  );
};

export const Card = ({
  title,
  subtitle,
  img,
  rounded,
  type,
  id,
  tracks,
  uri,
}: {
  title: string;
  subtitle: string;
  img: SpotifyApi.ImageObject;
  rounded: boolean;
  type: "album" | "playlist" | "artist" | "single" | "compilation";
  id: string;
  tracks?: number;
  uri?: string;
}) => {
  const [onHover, setOnHover] = useState(false);

  return (
    <div className="w-52 h-64">
      <Link href={`/${type === ("album" || "single") ? "album" : type}/${id}`}>
        <div
          onMouseEnter={() => {
            setOnHover(true);
          }}
          onMouseLeave={() => {
            setOnHover(false);
          }}
          className="p-2 m-2 w-full h-full items-center flex flex-col bg-slate-500 hover:bg-slate-600 duration-300 text-white rounded-xl"
        >
          <div className="px-4 py-1 pt-4 relative">
            <Image
              className={rounded ? "rounded-full" : "rounded-md"}
              src={img?.url || fallbackURL}
              height={"144px"}
              layout="fixed"
              objectFit="cover"
              width={"144px"}
              alt={type + " art"}
            />
            <div className="absolute right-4 bottom-4">
              <Play show={onHover} uri={uri} />
            </div>
          </div>
          <div className="flex flex-col w-full px-4 py-2">
            <div className="text-lg text-ellipsis overflow-hidden line-clamp-1">
              {title}
            </div>
            <div className="text-sm line-clamp-1 text-white/50">
              {subtitle === "single" &&
                (subtitle === "single" && tracks === 1 ? "single" : "EP")}
              {subtitle !== "single" && subtitle}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Card;
