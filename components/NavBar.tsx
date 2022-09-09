import React, { useContext } from "react";
import { AppContext } from "../context/context";
import Image from "next/image";
import {
  FiHome,
  FiSearch,
  FiBookmark,
  FiArrowRight,
  FiArrowLeft,
} from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/router";

const BackButton = () => {
  const router = useRouter();
  const goBack = () => {
    router.back();
  };

  return (
    <div
      onClick={goBack}
      className={`p-2 m-2 rounded-full text-white bg-slate-500
                  flex items-center text-lg hover:cursor-pointer
                  duration-150 ease-in-out hover:bg-slate-700 font-semibold`}
    >
      <FiArrowLeft />
    </div>
  );
};

const NavButton = ({
  title,
  link,
  icon,
}: {
  title: string;
  link: string;
  icon: React.ReactNode;
}) => {
  const router = useRouter();

  return (
    <Link href={link}>
      <div
        className={`p-2 m-2 mx-3 rounded-md text-white  
                    ${
                      router.pathname === link ? "bg-slate-700" : "bg-slate-500"
                    } 
                    flex items-center text-md hover:cursor-pointer hover:scale-110
                    duration-150 ease-in-out hover:bg-slate-700 font-semibold
                    focus:scale-100
                    `}
      >
        <div className="px-1">{icon}</div>
        <div className="px-1">{title}</div>
      </div>
    </Link>
  );
};

const NavBar = () => {
  const { state, dispatch } = useContext(AppContext);
  return (
    <div className="flex items-center w-full h-24 justify-around backdrop-blur-lg">
      <div className="flex items-center">
        <BackButton />
        <NavButton title="Home" icon={<FiHome />} link="/" />
        <NavButton title="Search" icon={<FiSearch />} link="/search" />
        <NavButton title="Your Library" icon={<FiBookmark />} link="/library" />
      </div>
      <div className="hover:scale-105">
        <Image
          className="rounded-full object-cover"
          src={
            state.user?.images[0].url ||
            "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bGVuc3xlbnwwfHwwfHw%3D&w=1000&q=80"
          }
          height={state.user?.images[0].height || 48}
          width={state.user?.images[0].width || 48}
        ></Image>
      </div>
    </div>
  );
};

export default NavBar;
