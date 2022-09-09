import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { getAlbum } from "../api/spotify/albums/[id]";
import Image from "next/image";
import TrackList from "../../components/TrackList";
import Head from "next/head";
import { getArtist } from "../api/spotify/artists/[id]";
import { getTopTracks } from "../api/spotify/artists/top-tracks/[id]";
import { getArtistAlbum } from "../api/spotify/artists/albums/[id]";

const Artist = ({
  artist,
  tracks,
  album,
}: {
  artist: SpotifyApi.ArtistObjectFull;
  tracks: SpotifyApi.TrackObjectFull[];
  album: SpotifyApi.AlbumObjectSimplified[];
}) => {
  return (
    <div className="flex flex-col mx-36 mb-4">
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

  console.log(artist);

  return {
    props: { artist, tracks, albums },
  };
}

export default Artist;
