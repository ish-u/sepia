import Link from "next/link";
import React from "react";
// import SearchBar from "../components/SearchBar";
import { useState, useEffect } from "react";
import SearchCard from "../components/SearchCard";
import { Track } from "../components/TrackList";

const Search = () => {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<SpotifyApi.SearchResponse | null>(null);

  const search = async () => {
    const res = await fetch(`/api/spotify/search?q=${query}`);
    const jsonData: SpotifyApi.SearchResponse = (await res.json()).data;
    console.log(jsonData);
    setData(jsonData);
    // if (data?.tracks?.items) {
    //   setTracks(data?.tracks?.items);
    // } else {
    //   setTracks([]);
    // }
  };

  useEffect(() => {
    search();
    if (query === "") {
      setData(null);
    }
  }, [query]);

  return (
    <div className="px-36 flex flex-col mb-24">
      <div>
        <input
          className="rounded-md px-4 py-2 my-4  text-xl outline-none focus:outline-none mx-auto"
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
          <div className="tracks mb-4">
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
          <div className="albums mb-4">
            <div className="text-2xl font-bold mx-2 my-1">Albums</div>
            <div className="flex justify-start">
              {data?.albums?.items.map((album) => {
                return (
                  <SearchCard
                    img={album.images[0]}
                    rounded={false}
                    title={album.name}
                    subtitle={album.artists
                      .map((artist) => artist.name)
                      .join(" ")}
                    type="album"
                    id={album.id}
                    key={album.id}
                  />
                );
              })}
            </div>
          </div>
          <div className="artists mb-4">
            <div className="text-2xl font-bold mx-2 my-1">Artists</div>
            <div className="flex justify-start">
              {data?.artists?.items.map((artist) => {
                return (
                  <SearchCard
                    img={artist.images[0]}
                    rounded={true}
                    title={artist.name}
                    subtitle="Artist"
                    type="artist"
                    id={artist.id}
                    key={artist.id}
                  />
                );
              })}
            </div>
          </div>
          <div className="playlist mb-4">
            <div className="text-2xl font-bold mx-2 my-1">Playlists</div>
            <div className="flex justify-start">
              {data?.playlists?.items.map((playlist) => {
                return (
                  <SearchCard
                    img={playlist.images[0]}
                    rounded={false}
                    title={playlist.name}
                    subtitle={"By " + playlist.owner.display_name}
                    type="playlist"
                    id={playlist.id}
                    key={playlist.id}
                  />
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Search;
