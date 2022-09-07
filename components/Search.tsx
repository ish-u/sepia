import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AppContext } from "../context/context";
import { ActionType } from "../context/actions";

const API_ENDPOINT: string = "https://api.spotify.com/v1";

const Search = () => {
  const { state, dispatch } = useContext(AppContext);

  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState([]);

  const playSong = async (id: string) => {
    const res = await fetch(
      `/api/spotify/player/toggle?id=${id}&device_id=${state.device_id}`
    );
    console.log(await res.json());
    dispatch({
      type: ActionType.Toggle,
      payload: {
        active: true,
      },
    });
  };

  const search = async () => {
    const res = await fetch(`/api/spotify/search?q=${query}`);
    const data = await res.json();
    if (data?.tracks) {
      setTracks(data?.tracks);
    } else {
      setTracks([]);
    }
  };

  useEffect(() => {
    search();
    if (query === "") {
      setTracks([]);
    }
  }, [query]);

  return (
    <div className="flex flex-col px-8 py-4">
      <span className="text-3xl font-bold mx-auto">Search for a Song!</span>
      <input
        className="rounded-lg px-4 py-2 my-4  text-xl outline-none focus:outline-none mx-auto"
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        placeholder="Search Song"
      ></input>
      {tracks.map((track: any) => (
        <div onClick={() => playSong(track?.id)} key={track?.id}>
          <div
            className="flex flex-row items-center align-middle
                      text-white m-2 p-4 hover:cursor-pointer 
                      hover:bg-slate-600/25 break-words"
          >
            <Image
              height="96"
              width="96"
              className="w-1/3"
              src={track?.album?.images[0].url}
              alt={track?.name}
            ></Image>

            <div className="ml-8 w-2/3">
              <h1 className="text-xl sm:text-4xl">{track?.name}</h1>
              <h1 className="text-lg">{track?.artists[0].name}</h1>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Search;
