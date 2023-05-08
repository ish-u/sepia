import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Play } from "../../../components/Card";
import LikeAlbum from "../../../components/LikeAlbum";
import TrackList from "../../../components/TrackList";
import { getAlbum, getServerAccessToken } from "../../../library/spotify";
const fetchAlbum = async (id: string) => {
  const accessToken = await getServerAccessToken();
  const album: SpotifyApi.AlbumObjectFull = await getAlbum(accessToken, id);

  return album;
};

const getFormattedTime = (seconds: number) => {
  return (
    Math.floor(seconds / 60) +
    " min " +
    ("0" + Math.floor(seconds % 60)).slice(-2) +
    " sec"
  );
};
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

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
export async function generateMetadata(
  { params, searchParams }: Props,
  parent?: ResolvingMetadata
): Promise<Metadata> {
  const { id } = params;
  try {
    const album = await fetchAlbum(id);
    return {
      title:
        album.name + " | " + album.artists.map((artist) => artist.name + " "),
      icons: {
        icon: album.images[0].url,
      },
    };
  } catch (e) {
    return {};
  }
}

export const revalidate = 86400;

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const album = await fetchAlbum(id);

  return (
    <div className="flex flex-col mb-4 pb-24">
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
            {album.type.toUpperCase()}
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
            <LikeAlbum albumId={album.id} />
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
              {copyright.text}
            </div>
          );
        })}
      </div>
    </div>
  );
}
