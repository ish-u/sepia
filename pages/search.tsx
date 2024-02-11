import { useEffect, useState } from "react";
import Slider from "../components/Slider";
import { Track } from "../components/TrackList";

const Search = () => {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<SpotifyApi.SearchResponse | null>(null);

  useEffect(() => {
    const search = async () => {
      const res = await fetch(`/api/spotify/search?q=${query}`);
      const jsonData: SpotifyApi.SearchResponse = (await res.json()).data;
      setData(jsonData);
    };
    search();
    if (query === "") {
      setData(null);
    }
  }, [query]);

  return (
    <div className="px-32 flex flex-col mb-24">
      <div>
        <input
          className="rounded-md px-4 py-2 my-4 text-xl outline-none focus:outline-none mx-auto"
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          placeholder="Search "
        ></input>
      </div>

      {data && (
        <>
          <div className="tracks mb-4 w-5/6">
            <div className="text-2xl font-bold mx-2 my-1">Tracks</div>
            {data?.tracks?.items.map((track) => (
              <Track
                showArtist={true}
                showIdx={false}
                track={track}
                key={track.id}
                img={track.album.images[0]}
              />
            ))}
          </div>
          <Slider
            title="Albums"
            albums={data?.albums?.items as SpotifyApi.AlbumObjectFull[]}
            type="album"
          />

          <Slider
            title="Artists"
            artists={data?.artists?.items as SpotifyApi.ArtistObjectFull[]}
            type="artist"
          />
          <Slider
            title="Playlists"
            playlists={
              data?.playlists?.items as SpotifyApi.PlaylistObjectFull[]
            }
            type="playlist"
          />
        </>
      )}
    </div>
  );
};

export default Search;
