import {
  MdFavorite,
  MdHomeFilled,
  MdLibraryMusic,
  MdQueueMusic,
  MdSearch,
} from "react-icons/md";
import { BackButton, NavButton } from "./NavButton";
import UserProfile from "./UserProfileMenu";

const NavBar = () => {
  return (
    <>
      <div className="flex items-center  h-24 justify-between backdrop-blur-lg mx-32">
        <div className="flex items-center">
          <BackButton />
          <NavButton title="Home" icon={<MdHomeFilled />} link="/app-dir" />
          <NavButton
            title="Search"
            icon={<MdSearch />}
            link="/app-dir/search"
          />
          <NavButton
            title="Your Library"
            icon={<MdLibraryMusic />}
            link="/app-dir/library"
          />
          <NavButton
            title="Liked"
            icon={<MdFavorite />}
            link="/app-dir/liked"
          />
          <NavButton
            title="Queue"
            icon={<MdQueueMusic />}
            link="/app-dir/queue"
          />
        </div>
        <UserProfile />
      </div>
    </>
  );
};

export default NavBar;
