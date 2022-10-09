import { GetStaticPropsContext } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import TrackList from "../../components/TrackList";
import Head from "next/head";
import {
  getPlaylist,
  getPlaylistTracks,
  getServerAccessToken,
  isPlaylistLiked,
  likePlaylist,
  unlikePlaylist,
} from "../../library/spotify";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Play } from "../../components/Card";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";

import fallbackURL from "../../public/fallback.jpg";

const Playlist = ({
  playlist,
  tracks,
}: {
  playlist: SpotifyApi.PlaylistObjectFull;
  tracks: SpotifyApi.TrackObjectFull[];
}) => {
  const { data: session } = useSession();

  // Playlist is liked or not
  const [liked, setLiked] = useState(false);
  useEffect(() => {
    if (session?.accessToken) {
      (async () => {
        const isLiked: boolean = (
          await isPlaylistLiked(
            session?.accessToken || "",
            session?.userID || "",
            playlist.id
          )
        )[0];
        setLiked(isLiked);
      })();
    }
  }, [session?.accessToken, playlist.id, session?.userID]);

  // toggle the like button
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
    <div className="mx-32 mb-32 my-4">
      <Head>
        <title>{playlist.name}</title>
        {playlist.images.length && (
          <link rel="icon" type="image" href={playlist.images[0].url} />
        )}
      </Head>
      <div className="mx-8 flex">
        <div className="p-4">
          <Image
            className="object-cover"
            layout="fixed"
            height={240}
            width={240}
            src={playlist.images.length ? playlist.images[0].url : fallbackURL}
            alt="Playlist Art"
          ></Image>
        </div>
        <div className="flex flex-col justify-end p-4 mb-2">
          <div className="text-6xl font-bold py-2 line-clamp-1">
            {playlist.name}
          </div>
          <div className="text-xl font-bold flex items-center">
            <div className="mr-2 text-black/75">Feat.</div>
            {tracks.slice(0, 5).map((track) => (
              <Link href={`/artist/${track.artists[0].id}`} key={track.id}>
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

export async function getStaticProps(context: GetStaticPropsContext) {
  const id = context.params?.id;
  const accessToken = await getServerAccessToken();

  // get the Playlist Details
  const playlist: SpotifyApi.PlaylistObjectFull = await getPlaylist(
    id as string,
    accessToken
  );

  // get all the playlist tracks
  const playlistTracks = [];
  var offset = 0;
  do {
    const tracks: SpotifyApi.PlaylistTrackResponse = await getPlaylistTracks(
      playlist.id,
      offset,
      accessToken
    );

    for (var i = 0; i < tracks.items.length; i++) {
      if (tracks.items[i] !== null && tracks.items[i].track !== null) {
        playlistTracks.push(tracks.items[i].track);
      }
    }

    offset += 100;
  } while (offset < playlist.tracks.total);

  return {
    props: { playlist, tracks: playlistTracks },
    revalidate: 3600,
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export default Playlist;
