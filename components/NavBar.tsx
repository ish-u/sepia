"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  MdArrowBack,
  MdFavorite,
  MdHomeFilled,
  MdLibraryMusic,
  MdLogout,
  MdQueueMusic,
  MdSearch,
} from "react-icons/md";

const BackButton = () => {
  const router = useRouter();
  const pathName = usePathname();
  const goBack = () => {
    if (pathName !== "/") {
      router.back();
    }
  };

  return (
    <div
      onClick={goBack}
      className={`p-2 my-2 mr-2 rounded-full text-white bg-slate-500
                  flex items-center text-lg hover:cursor-pointer
                  duration-150 ease-in-out hover:bg-slate-700 font-semibold`}
    >
      <MdArrowBack />
    </div>
  );
};

const NavButton = ({
  title,
  link,
  icon,
  onClick,
}: {
  title: string;
  link: string;
  icon: React.ReactNode;
  onClick?: () => void;
}) => {
  const pathName = usePathname();
  return (
    <>
      {onClick ? (
        <div
          className={`p-2 m-2 mx-3 rounded-md text-white  
        ${pathName === link ? "bg-slate-700" : "bg-slate-500"} 
        flex items-center text-md hover:cursor-pointer 
        duration-150 ease-in-out hover:bg-slate-700 font-semibold
        `}
          onClick={onClick}
        >
          <div className="px-1 text-xl">{icon}</div>
          <div className="px-0 md:px-1 w-0 md:w-full hidden md:flex">
            {title}
          </div>
        </div>
      ) : (
        <Link shallow={true} href={link}>
          <div
            className={`p-2 m-2 mx-3 rounded-md text-white  
        ${pathName === link ? "bg-slate-700" : "bg-slate-500"} 
        flex items-center text-md hover:cursor-pointer 
        duration-150 ease-in-out hover:bg-slate-700 font-semibold
        `}
          >
            <div className="px-1 text-xl">{icon}</div>
            <div className="px-0 md:px-1 w-0 md:w-full hidden md:flex">
              {title}
            </div>
          </div>
        </Link>
      )}
    </>
  );
};

const NavBar = () => {
  const { status, data: session } = useSession();

  return (
    <>
      <div className="flex items-center h-24 md:justify-between backdrop-blur-lg mx-32">
        <div className="flex items-center">
          <BackButton />
          <NavButton title="Home" icon={<MdHomeFilled />} link="/" />
          <NavButton title="Search" icon={<MdSearch />} link="/search" />
          <NavButton
            title="Library"
            icon={<MdLibraryMusic />}
            link="/library"
          />
          <NavButton title="Liked" icon={<MdFavorite />} link="/liked" />
          <NavButton title="Queue" icon={<MdQueueMusic />} link="/queue" />
        </div>
        <NavButton
          title="Sign Out"
          icon={<MdLogout />}
          link=""
          onClick={() => signOut()}
        />
      </div>
    </>
  );
};

export default NavBar;
