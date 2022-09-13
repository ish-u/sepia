import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";

import Image from "next/image";
import TrackList, { Track } from "../../components/TrackList";
import Head from "next/head";
import Card from "../../components/Card";
import { getPlaylist } from "../../library/spotify";
import Link from "next/link";

const Playlist = ({
  playlist,
  tracks,
}: {
  playlist: SpotifyApi.PlaylistObjectFull;
  tracks: SpotifyApi.TrackObjectFull[];
}) => {
  return (
    <div className="mx-32 my-4">
      <div className="mx-8 flex">
        <div className="p-4">
          <Image
            layout="fixed"
            height={240}
            width={240}
            src={playlist.images[0].url}
            alt="Playlist Art"
          ></Image>
        </div>
        <div className="flex flex-col justify-end p-4">
          <div className="text-8xl font-bold my-8">{playlist.name}</div>
          <div className="text-xl font-bold flex items-center">
            <div className="mr-2 text-black/75">Feat.</div>
            {tracks.slice(0, 3).map((track) => (
              <Link href={track.artists[0].id} key={track.id}>
                <div className="hover:underline mr-2">
                  {track.artists[0].name}
                </div>
              </Link>
            ))}
            <div className="mr-2 text-black/75">and more</div>
          </div>
          <div className="flex text-md mt-2">
            <div className="text-black/75 mr-1">Made By</div>
            <div className="mr-2 text-bold">{playlist.owner.display_name}</div>
            <div className="mr-2">{playlist.tracks.total} Songs</div>
          </div>
        </div>
      </div>
      <TrackList
        tracks={tracks}
        showArtist={true}
        showIdx={true}
        showAlbum={true}
      />
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.query;
  const session = await getSession(context);
  const playlist = await getPlaylist(id as string, session?.accessToken || "");

  const tracks = [];
  for (var i = 0; i < playlist.tracks.items.length; i++) {
    tracks.push(playlist.tracks.items[i].track);
  }

  console.log(tracks);

  return {
    props: { playlist, tracks },
  };
}

export default Playlist;
