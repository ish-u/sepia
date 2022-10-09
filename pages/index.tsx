import { useContext } from "react";
import { AppContext } from "../context/context";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import {
  getFeaturedPlaylists,
  getNewReleases,
  getRecentPlayed,
  getUserTopItems,
} from "../library/spotify";
import { Track } from "../components/TrackList";
import Slider from "../components/Slider";

const Home = ({
  recently,
  top_artists,
  top_tracks,
  releases,
  featured,
}: {
  recently: SpotifyApi.TrackObjectFull[];
  top_artists: SpotifyApi.UsersTopArtistsResponse;
  top_tracks: SpotifyApi.TrackObjectFull[];
  releases: SpotifyApi.ListOfNewReleasesResponse;
  featured: SpotifyApi.ListOfFeaturedPlaylistsResponse;
}) => {
  const { state, dispatch } = useContext(AppContext);
  return (
    <div className="m-4 mx-32 mb-32">
      <div className="text-4xl mb-8">
        welcome
        <span className="font-bold mx-2">{state.user?.display_name}</span>
      </div>

      <Slider
        title="Your Top Artists"
        type="artist"
        artists={top_artists.items}
      />

      <Slider
        title="New Releases"
        type="album"
        albums={releases.albums.items as SpotifyApi.AlbumObjectFull[]}
      />

      <Slider
        title={featured.message || ""}
        type="playlist"
        playlists={featured.playlists.items as SpotifyApi.PlaylistObjectFull[]}
      />

      <div className="flex w-full items-center">
        <div className="w-3/6 my-8">
          <div className="text-3xl px-4 my-4 font-semibold">
            Recently Played
          </div>
          {recently.map((track) => {
            return (
              <Track
                showArtist={true}
                showIdx={false}
                img={track.album.images[0]}
                key={track.id}
                track={track}
              />
            );
          })}
        </div>
        <div className="w-3/6 my-8">
          <div className="text-3xl px-4 my-4 font-semibold">Top Tracks</div>
          {top_tracks.map((track) => (
            <Track
              showArtist={true}
              showIdx={false}
              img={track.album.images[0]}
              key={track.id}
              track={track}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  if (session?.accessToken) {
    const recently: SpotifyApi.TrackObjectFull[] = (
      (await getRecentPlayed(
        session?.accessToken || ""
      )) as SpotifyApi.UsersRecentlyPlayedTracksResponse
    ).items
      .map((item) => item.track)
      .slice(0, 5);

    const top_tracks: SpotifyApi.TrackObjectFull[] = (
      await getUserTopItems(session?.accessToken, "tracks")
    ).items.slice(0, 5);

    const top_artists: SpotifyApi.UsersTopArtistsResponse =
      await getUserTopItems(session?.accessToken, "artists");

    const featured: SpotifyApi.ListOfFeaturedPlaylistsResponse =
      await getFeaturedPlaylists(session.accessToken);

    const releases: SpotifyApi.ListOfNewReleasesResponse = await getNewReleases(
      session.accessToken
    );

    return {
      props: {
        recently,
        top_artists,
        top_tracks,
        featured,
        releases,
      },
    };
  }

  return {
    props: {},
  };
}

export default Home;
