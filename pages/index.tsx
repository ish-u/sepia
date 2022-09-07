import type { NextPage } from "next";
import Player from "../components/Player/index";
import Search from "../components/Search";

const Home: NextPage = () => {
  return (
    <div className="w-full h-full flex justify-center bg-red-500">
      <Search />
      <Player />
    </div>
  );
};

export default Home;
