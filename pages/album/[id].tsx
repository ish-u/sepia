import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { getAlbum } from "../api/spotify/albums/[id]";
import Image from "next/image";
import TrackList from "../../components/TrackList";
import Head from "next/head";
import Link from "next/link";

const getFormattedTime = (seconds: number) => {
  return (
    Math.floor(seconds / 60) +
    " min " +
    ("0" + Math.floor(seconds % 60)).slice(-2) +
    " sec"
  );
};

const Album = ({ album }: { album: SpotifyApi.AlbumObjectFull }) => {
  const getAlbumDuration = (
    tracks: SpotifyApi.TrackObjectSimplified[]
  ): string => {
    var duration = 0;
    for (var i = 0; i < tracks.length; i++) {
      duration += tracks[i].duration_ms;
    }
    duration = duration / 1000;
    return getFormattedTime(duration);
  };

  return (
    <div className="flex flex-col mx-36 mb-4 pb-24">
      <Head>
        <title>
          {album.name} | {album.artists.map((artist) => artist.name)}
        </title>
        <link rel="icon" href={album.images[0].url} />
      </Head>
      {/* TOP AREA */}
      <div className="flex justify-start ">
        <div className="p-8 relative ">
          <Image
            src={album.images[0].url}
            height={240}
            width={240}
            layout="fixed"
          />
        </div>
        <div className="grow py-8 flex flex-col justify-end">
          <div className="text-xs m-2 font-bold">
            {album.type.toUpperCase()}
          </div>
          <div className="text-6xl font-bold break-words">{album.name}</div>
          <div className="text-md  m-2 flex font-bold">
            {album.artists.map((artist) => {
              return (
                <div className="flex mr-1">
                  <div className="hover:underline">
                    <Link href={`/artist/${artist.id}`}>{artist.name}</Link>
                  </div>
                  <span> - </span>
                </div>
              );
            })}
            <div className="mr-1">{album.release_date.split("-")[0]} -</div>
            <div className="mr-1 ">
              <span>{album.total_tracks} Songs, </span>
              <span className="text-black/50">
                {getAlbumDuration(album.tracks.items)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <TrackList tracks={album.tracks.items} />
      <div className="py-2 px-12 ">
        <div className="text-md font-light">
          {new Intl.DateTimeFormat("en-US", {
            dateStyle: "long",
          }).format(new Date(album.release_date))}
        </div>
        {album.copyrights.map((copyright) => {
          return (
            <div className="text-xs font-extralight">{copyright.text}</div>
          );
        })}
      </div>
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.query;
  const session = await getSession(context);
  const album: SpotifyApi.AlbumObjectFull = await (
    await getAlbum(session?.accessToken || "", id as string)
  ).json();
  console.log(album);

  return {
    props: { album },
  };
}

export default Album;
