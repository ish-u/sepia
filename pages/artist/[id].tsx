import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import Image from "next/image";
import { Track } from "../../components/TrackList";
import Head from "next/head";
import { getArtist } from "../api/spotify/artists/[id]";
import { getTopTracks } from "../api/spotify/artists/top-tracks/[id]";
import { getArtistAlbum } from "../api/spotify/artists/albums/[id]";
import Card from "../../components/Card";
import { useState } from "react";

const Artist = ({
  artist,
  tracks,
  albums,
}: {
  artist: SpotifyApi.ArtistObjectFull;
  tracks: SpotifyApi.TrackObjectFull[];
  albums: SpotifyApi.AlbumObjectSimplified[];
}) => {
  const [albumType, setAlbumType] = useState("recent");
  const [showAll, setShowAll] = useState(5);

  const toggleTopSongs = () => {
    if (showAll === 5) {
      setShowAll(10);
    } else if (showAll === 10) {
      setShowAll(5);
    }
  };

  return (
    <div className="flex flex-col justify-start mx-36 mb-4 pb-24">
      {/* TOP */}
      <div className="flex items-center">
        <div className="relative p-8">
          <Image
            className="rounded-full"
            src={artist.images[0].url}
            height={240 || artist.images[0].height}
            width={240 || artist.images[0].width}
            layout="intrinsic"
            objectFit="cover"
          ></Image>
        </div>

        <div>
          <div className="text-8xl font-bold px-8">{artist.name}</div>
          <div className="text-xl font-semibold px-8 py-2 text-black/50">
            {new Intl.NumberFormat("en-US", {
              notation: "compact",
            }).format(artist.followers.total)}{" "}
            FOLLOWERS
          </div>
        </div>
      </div>
      {/* TOP TRACKS */}

      <div className="w-5/6">
        <div className="text-2xl mx-2 mb-4 font-bold">Popular</div>
        {tracks.slice(0, showAll).map((track, idx) => (
          <Track
            track={track}
            key={track.id}
            idx={idx + 1}
            showArtist={false}
            showIdx={true}
          />
        ))}
        <div
          className="m-2 font-semibold text-black/75 hover:text-black hover:cursor-pointer"
          onClick={toggleTopSongs}
        >
          SEE MORE
        </div>
      </div>
      {/* DISCOGRAPHY */}
      <div>
        <div className="text-2xl mx-2 my-4 font-bold">Discography</div>
        <div className="text-md text-white/75 mx-2 my-2 flex">
          <div
            className={`mr-2 px-2 py-1 border ${
              albumType === "recent" ? "bg-slate-500" : "bg-slate-400"
            } rounded-full hover:bg-slate-500`}
            onClick={() => {
              setAlbumType("recent");
            }}
          >
            Recent
          </div>

          <div
            className={`mr-2 px-2 py-1 border ${
              albumType === "album" ? "bg-slate-500" : "bg-slate-400"
            } rounded-full hover:bg-slate-500`}
            onClick={() => {
              setAlbumType("album");
            }}
          >
            Album
          </div>
          <div
            className={`mr-2 px-2 py-1 border ${
              albumType === "single" ? "bg-slate-500" : "bg-slate-400"
            } rounded-full hover:bg-slate-500`}
            onClick={() => {
              setAlbumType("single");
            }}
          >
            Singles & EP
          </div>
        </div>
        <div className="flex justify-start overflow-hidden">
          {albums.map((album) => {
            if (albumType === album.album_type || albumType === "recent") {
              return (
                <Card
                  key={album.id}
                  id={album.id}
                  img={album.images[0]}
                  rounded={false}
                  title={album.name}
                  subtitle={album.album_type}
                  type={album.album_type}
                  tracks={album.total_tracks}
                />
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.query;
  const session = await getSession(context);
  const artist: SpotifyApi.ArtistObjectSimplified = await (
    await getArtist(session?.accessToken || "", id as string)
  ).json();
  const tracks: SpotifyApi.TrackObjectFull[] = (
    await (await getTopTracks(session?.accessToken || "", id as string)).json()
  ).tracks;
  const albums: SpotifyApi.AlbumObjectSimplified[] = (
    await (
      await getArtistAlbum(session?.accessToken || "", id as string)
    ).json()
  ).items;

  return {
    props: { artist, tracks, albums },
  };
}

export default Artist;
