import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { getAlbum } from "../api/spotify/albums/[id]";
import Image from "next/image";
import TrackList from "../../components/TrackList";

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
    <div className="flex flex-col mx-36 mb-4">
      {/* TOP AREA */}
      <div className="flex">
        <div className="p-8">
          <Image
            src={album.images[0].url}
            height={240 || album.images[0].height}
            width={240 || album.images[0].width}
            objectFit="cover"
          />
        </div>
        <div className="grow py-8 flex flex-col justify-end">
          <div className="text-xs m-2 font-bold">
            {album.type.toUpperCase()}
          </div>
          <div className="text-6xl font-bold">{album.name}</div>
          <div className="text-md  m-2 flex font-bold">
            {album.artists.map((artist) => {
              return (
                <div className="flex mr-1">
                  <div>{artist.name} -</div>
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
