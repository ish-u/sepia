import type { NextPage } from "next";
import { useContext } from "react";
import { AppContext } from "../context/context";

const Home: NextPage = () => {
  const { state, dispatch } = useContext(AppContext);
  return (
    <div className="flex m-4 mx-32">
      <div className="text-4xl">
        welcome
        <span className="font-bold mx-2">{state.user?.display_name}</span>
      </div>
    </div>
  );
};

export default Home;
