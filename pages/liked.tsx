import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getUserLikedTracks } from "../library/spotify";
import TrackList from "../components/TrackList";
import { MdFavoriteBorder } from "react-icons/md";

const Liked = () => {
  const { data: session } = useSession();
  const [tracks, setTracks] = useState<SpotifyApi.TrackObjectFull[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const getTracks = async () => {
      if (!tracks.length && session?.accessToken) {
        const res: SpotifyApi.UsersSavedTracksResponse =
          await getUserLikedTracks(session?.accessToken || "", 0);
        res.items.map((item) => {
          setTracks((prev) => {
            if (prev.findIndex((x) => x.id === item.track.id) === -1) {
              return [...prev, item.track];
            }
            return prev;
          });
        });
        setTotal(res.total);
        for (var i = res.limit; i <= res.total; i = i + res.limit) {
          setTimeout(() => {}, 1000);
          const res1: SpotifyApi.UsersSavedTracksResponse =
            await getUserLikedTracks(session?.accessToken || "", i);
          res1.items.map((item) => {
            setTracks((prev) => {
              if (prev.findIndex((x) => x.id === item.track.id) === -1) {
                return [...prev, item.track];
              }
              return prev;
            });
          });
        }
      }
    };
    getTracks();
  }, [session?.accessToken, tracks.length]);

  return (
    <div className="mx-36 my-8 mb-32">
      <div className="mx-8">
        <div className="text-6xl font-semibold  flex">
          <MdFavoriteBorder />
          <span className="ml-4">{total} Liked Songs</span>
        </div>
      </div>
      <div className="my-10">
        <TrackList
          tracks={tracks}
          showAlbum={true}
          showArtist={true}
          showIdx={true}
        />
      </div>
    </div>
  );
};

export default Liked;
