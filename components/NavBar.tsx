import Image from "next/image";
import {
  MdArrowBack,
  MdFavorite,
  MdHomeFilled,
  MdLibraryMusic,
  MdQueueMusic,
  MdSearch,
} from "react-icons/md";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

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
      <MdArrowBack />
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
        <div className="px-1 text-xl">{icon}</div>
        <div className="px-1">{title}</div>
      </div>
    </Link>
  );
};

const NavBar = () => {
  const { status, data: session } = useSession();
  return (
    <>
      {status === "authenticated" ? (
        <div className="flex items-center w-full h-24 justify-around backdrop-blur-lg">
          <div className="flex items-center">
            <BackButton />
            <NavButton title="Home" icon={<MdHomeFilled />} link="/" />
            <NavButton title="Search" icon={<MdSearch />} link="/search" />
            <NavButton
              title="Your Library"
              icon={<MdLibraryMusic />}
              link="/library"
            />
            <NavButton title="Liked" icon={<MdFavorite />} link="/liked" />
            <NavButton title="Queue" icon={<MdQueueMusic />} link="/queue" />
          </div>
          <div className="hover:scale-105">
            <Image
              className="rounded-full object-cover"
              src={
                session.user?.image ||
                "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bGVuc3xlbnwwfHwwfHw%3D&w=1000&q=80"
              }
              height={48}
              width={48}
              alt="User Profile"
            ></Image>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default NavBar;
