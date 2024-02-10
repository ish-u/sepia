import { GetStaticPropsContext } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { Play } from "../../components/Card";
import TrackList from "../../components/TrackList";
import {
  getAlbum,
  getServerAccessToken,
  isAlbumLiked,
  likeAlbum,
  unlikeAlbum,
} from "../../library/spotify";

const getFormattedTime = (seconds: number) => {
  return (
    Math.floor(seconds / 60) +
    " min " +
    ("0" + Math.floor(seconds % 60)).slice(-2) +
    " sec"
  );
};

const Album = ({
  album,
  isLiked,
}: {
  album: SpotifyApi.AlbumObjectFull;
  isLiked?: boolean;
}) => {
  const [liked, setLiked] = useState(isLiked);
  const { data: session } = useSession();

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

  const toggleLiked = async () => {
    if (liked) {
      await unlikeAlbum(session?.accessToken || "", album.id);
      setLiked(false);
    } else {
      await likeAlbum(session?.accessToken || "", album.id);
      setLiked(true);
    }
  };

  useEffect(() => {
    if (session?.accessToken) {
      (async () => {
        const isLiked = (await isAlbumLiked(session?.accessToken, album.id))[0];
        setLiked(isLiked);
      })();
    }
  }, [session?.accessToken, album.id]);

  return (
    <div className="flex flex-col mx-36 mb-4 pb-24">
      <Head>
        <title>
          {album.name} | {album.artists.map((artist) => artist.name).toString()}
        </title>
        {album.images && <link rel="icon" href={album.images[0].url} />}
      </Head>
      {/* TOP AREA */}
      <div className="flex justify-start ">
        <div className="p-8 relative ">
          <Image
            src={album.images[0].url}
            height={240}
            width={240}
            alt="Album Cover"
          />
        </div>
        <div className="grow py-8 flex flex-col justify-end">
          <div className="text-xs m-2 font-bold">
            {album.album_type === "single" && album.total_tracks > 1
              ? "EP"
              : album.album_type.toUpperCase()}
          </div>
          <div className="text-6xl font-bold line-clamp-1 py-2">
            {album.name}
          </div>
          <div className="text-md  m-2 flex font-bold">
            {album.artists.map((artist) => {
              return (
                <div className="flex mr-1" key={artist.id}>
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
          <div className="m-2 flex items-center">
            <Play show={true} uri={album.uri} />
            <div className="mx-4 text-4xl" onClick={toggleLiked}>
              {liked ? <MdFavorite /> : <MdFavoriteBorder />}
            </div>
          </div>
        </div>
      </div>
      <TrackList
        tracks={album.tracks.items as SpotifyApi.TrackObjectFull[]}
        showAlbum={false}
        showIdx={true}
        showArtist={true}
      />
      <div className="py-2 px-12 ">
        <div className="text-md font-light">
          {new Intl.DateTimeFormat("en-US", {
            dateStyle: "long",
          }).format(new Date(album.release_date))}
        </div>
        {album.copyrights.map((copyright, idx) => {
          return (
            <div className="text-xs font-extralight" key={copyright.text + idx}>
              {(copyright.type === "C" ? "© " : "℗ ") + copyright.text}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   const { id } = context.query;
//   const session = await getSession(context);
//   const album: SpotifyApi.AlbumObjectFull = await getAlbum(
//     session?.accessToken || "",
//     id as string
//   );
//   const isLiked: boolean = (
//     await isAlbumLiked(session?.accessToken || "", album.id)
//   )[0];
//   return {
//     props: { album, isLiked },
//   };
// }

export async function getStaticProps(context: GetStaticPropsContext) {
  const id = context.params?.id as string;
  const accessToken = await getServerAccessToken();
  const album: SpotifyApi.AlbumObjectFull = await getAlbum(accessToken, id);
  // const isLiked: boolean = (await isAlbumLiked(accessToken, album.id))[0];
  return {
    props: { album },
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export default Album;
