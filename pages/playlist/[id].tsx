import { GetServerSidePropsContext } from "next";
import { getSession, useSession } from "next-auth/react";
import Image from "next/image";
import TrackList from "../../components/TrackList";
import Head from "next/head";
import {
  getPlaylist,
  isPlaylistLiked,
  likePlaylist,
  unlikePlaylist,
} from "../../library/spotify";
import Link from "next/link";
import { useState } from "react";
import { Play } from "../../components/Card";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";

const Playlist = ({
  playlist,
  tracks,
  isLiked,
}: {
  playlist: SpotifyApi.PlaylistObjectFull;
  tracks: SpotifyApi.TrackObjectFull[];
  isLiked: boolean;
}) => {
  const { data: session } = useSession();

  const [liked, setLiked] = useState(isLiked);
  const toggleLiked = async () => {
    if (liked) {
      await unlikePlaylist(session?.accessToken || "", playlist.id);
      setLiked(false);
    } else {
      await likePlaylist(session?.accessToken || "", playlist.id);
      setLiked(true);
    }
  };

  return (
    <div className="mx-32 my-4">
      <Head>
        <title>{playlist.name}</title>
        {playlist.images && <link rel="icon" href={playlist.images[0].url} />}
      </Head>
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
        <div className="flex flex-col justify-end p-4 mb-2">
          <div className="text-6xl font-bold py-2 line-clamp-1">
            {playlist.name}
          </div>
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
          <div className="mt-4 flex items-center">
            <Play show={true} uri={playlist.uri} />
            <div className="mx-4 text-4xl" onClick={toggleLiked}>
              {liked ? <MdFavorite /> : <MdFavoriteBorder />}
            </div>
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
  const playlist: SpotifyApi.PlaylistObjectFull = await getPlaylist(
    id as string,
    session?.accessToken || ""
  );
  const tracks = [];
  for (var i = 0; i < playlist.tracks.items.length; i++) {
    tracks.push(playlist.tracks.items[i].track);
  }
  const isLiked: boolean = (
    await isPlaylistLiked(
      session?.accessToken || "",
      session?.userID || "",
      playlist.id
    )
  )[0];
  return {
    props: { playlist, tracks, isLiked },
  };
}

export default Playlist;
