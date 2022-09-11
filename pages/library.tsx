import React, { useEffect, useState } from "react";
import { GetServerSidePropsContext } from "next";
import { getSession, useSession } from "next-auth/react";
import { getUserSavedAlbums, getUserSavedPlaylists } from "../library/spotify";
import Card from "../components/Card";

const Library = () => {
  const { data: session } = useSession();
  const [albums, setAlbums] = useState<SpotifyApi.AlbumObjectFull[]>([]);
  const [playlists, setPlaylists] = useState<
    SpotifyApi.PlaylistObjectSimplified[]
  >([]);
  const [toShow, setToShow] = useState<"albums" | "playlists">("albums");

  const getAlbums = async () => {
    if (session?.accessToken) {
      var total = 50;
      var i = 0;
      do {
        var res: SpotifyApi.UsersSavedAlbumsResponse = await getUserSavedAlbums(
          session?.accessToken,
          i
        );
        total = res.total;
        res.items.map((album) => {
          setAlbums((prev) => {
            if (prev.findIndex((x) => x.id === album.album.id) === -1) {
              return [...prev, album.album];
            }
            return prev;
          });
        });
        i += 50;
      } while (i < total);
    }
  };

  const getPlaylists = async () => {
    if (session?.accessToken) {
      var total = 50;
      var i = 0;
      do {
        var res: SpotifyApi.ListOfUsersPlaylistsResponse =
          await getUserSavedPlaylists(session?.accessToken, i);
        total = res.total;
        res.items.map((playlist) => {
          setPlaylists((prev) => {
            if (prev.findIndex((x) => x.id === playlist.id) === -1) {
              return [...prev, playlist];
            }
            return prev;
          });
        });
        i += 50;
      } while (i < total);
    }
  };

  useEffect(() => {
    if (session?.accessToken) {
      getAlbums();
      getPlaylists();
    }
  }, [session?.accessToken]);

  return (
    <div className="mx-32 my-4 mb-32">
      <div className="flex justify-start">
        <div
          className={`p-2 ml-4  font-semibold rounded-md ${
            toShow === "albums" ? "bg-slate-600" : "bg-slate-400"
          } text-white hover:bg-slate-500`}
          onClick={() => {
            setToShow("albums");
          }}
        >
          Albums
        </div>
        <div
          className={`p-2 ml-4  font-semibold rounded-md ${
            toShow === "playlists" ? "bg-slate-600" : "bg-slate-400"
          } text-white hover:bg-slate-500`}
          onClick={() => {
            setToShow("playlists");
          }}
        >
          Playlists
        </div>
      </div>
      <div className="flex justify-start flex-wrap">
        {toShow === "albums" &&
          albums &&
          albums.map((album) => (
            <div className="m-4" key={album.id}>
              <Card
                id={album.id}
                img={album.images[0]}
                rounded={false}
                title={album.name}
                subtitle={album.type}
                type={album.type}
              />
            </div>
          ))}
        {toShow === "playlists" &&
          playlists &&
          playlists.map((playlist) => (
            <div className="m-4" key={playlist.id}>
              <Card
                id={playlist.id}
                img={playlist.images[0]}
                rounded={false}
                title={playlist.name}
                subtitle={`By ${playlist.owner.display_name}`}
                type="playlist"
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default Library;
