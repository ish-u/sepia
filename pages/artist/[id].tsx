import { GetStaticPropsContext } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { Track } from "../../components/TrackList";
import {
  checkFollowing,
  followArtist,
  getArtist,
  getArtistAlbum,
  getServerAccessToken,
  getTopTracks,
  unfollowArtist,
} from "../../library/spotify";

import { useEffect, useState } from "react";
import Card, { Play } from "../../components/Card";

const Artist = ({
  artist,
  tracks,
  albums,
  follows,
}: {
  artist: SpotifyApi.ArtistObjectFull;
  tracks: SpotifyApi.TrackObjectFull[];
  albums: SpotifyApi.AlbumObjectSimplified[];
  follows?: boolean;
}) => {
  const { data: session } = useSession();

  const [albumType, setAlbumType] = useState("recent");
  const [showAll, setShowAll] = useState(5);
  const [following, setFollowing] = useState(follows);

  useEffect(() => {
    if (session?.accessToken) {
      (async () => {
        const isFollowing = (
          await checkFollowing(artist.id, session.accessToken)
        )[0];
        setFollowing(isFollowing);
      })();
    }
  }, [session?.accessToken, artist.id]);

  const toggleFollow = async () => {
    if (following) {
      await unfollowArtist(artist.id, session?.accessToken || "");
      setFollowing(false);
    } else {
      await followArtist(artist.id, session?.accessToken || "");
      setFollowing(true);
    }
  };

  const toggleTopSongs = () => {
    if (showAll === 5) {
      setShowAll(10);
    } else if (showAll === 10) {
      setShowAll(5);
    }
  };

  return (
    <div className="flex flex-col justify-start mx-36 mb-4 pb-24">
      <Head>
        <title>{artist.name}</title>
        {artist.images && <link rel="icon" href={artist.images[0].url} />}
      </Head>
      {/* TOP */}
      <div className="flex items-center">
        <div className={`relative p-8`}>
          <div className="relative w-[240px] h-[240px]">
            <Image
              className="rounded-full"
              src={artist.images[0].url}
              fill={true}
              style={{
                objectFit: "cover",
              }}
              alt="Artist Picture"
            ></Image>
          </div>
        </div>

        <div className="px-8">
          <div className="text-6xl pb-4 font-bold line-clamp-2">
            {artist.name}
          </div>
          <div className="text-xl font-semibold py-2 text-black/50">
            {new Intl.NumberFormat("en-US", {
              notation: "compact",
            }).format(artist.followers.total)}{" "}
            FOLLOWERS
          </div>
          <div className="py-4 flex items-center">
            <Play show={true} uri={artist.uri} />
            <div
              className="hover:cursor-pointer text-lg"
              onClick={() => {
                toggleFollow();
              }}
            >
              {following ? (
                <button className="p-2 mx-4 hover:bg-black/5 font-bold border-black  border rounded-md">
                  FOLLOWING
                </button>
              ) : (
                <button className="p-2 mx-4 hover:bg-black/5  font-bold border-black  border rounded-md">
                  FOLLOW
                </button>
              )}
            </div>
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
            } rounded-full border-transparent hover:bg-slate-500`}
            onClick={() => {
              setAlbumType("recent");
            }}
          >
            Recent
          </div>

          <div
            className={`mr-2 px-2 py-1 border ${
              albumType === "album" ? "bg-slate-500" : "bg-slate-400"
            } rounded-full border-transparent hover:bg-slate-500`}
            onClick={() => {
              setAlbumType("album");
            }}
          >
            Album
          </div>
          <div
            className={`mr-2 px-2 py-1 border ${
              albumType === "single" ? "bg-slate-500" : "bg-slate-400"
            } rounded-full border-transparent hover:bg-slate-500`}
            onClick={() => {
              setAlbumType("single");
            }}
          >
            Singles & EP
          </div>
        </div>
        <div className="flex justify-start my-4 overflow-x-scroll">
          {albums.map((album) => {
            if (albumType === album.album_type || albumType === "recent") {
              return (
                <div key={album.id} className="mr-4 my-2 mb-4">
                  <Card
                    id={album.id}
                    img={album.images[0]}
                    rounded={false}
                    title={album.name}
                    subtitle={album.album_type}
                    type={album.album_type}
                    tracks={album.total_tracks}
                    uri={album.uri}
                  />
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};

export async function getStaticProps(context: GetStaticPropsContext) {
  const id = context.params?.id as string;
  const accessToken = await getServerAccessToken();

  // getting information about the artist
  const artist: SpotifyApi.ArtistObjectFull = await getArtist(accessToken, id);
  const tracks: SpotifyApi.TrackObjectFull[] = (
    await getTopTracks(accessToken, id as string)
  ).tracks;
  const albums: SpotifyApi.AlbumObjectSimplified[] = (
    await getArtistAlbum(accessToken, id as string)
  ).items;

  return {
    props: { artist, tracks, albums },
    revalidate: 60 * 60 * 24,
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}
export default Artist;
