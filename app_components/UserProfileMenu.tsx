"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { MdAccountCircle, MdLogout } from "react-icons/md";
import { Menu } from "../components/Menu";
import { MenuItem } from "../components/Menu/MenuItem";

const ProfileButton = () => {
  const { status, data: session } = useSession();

  if (status === "authenticated" && session.user?.image) {
    return (
      <div className="hover:scale-105">
        <Image
          className="rounded-full object-cover"
          src={session.user?.image}
          height={48}
          width={48}
          alt="User Profile"
        ></Image>
      </div>
    );
  }

  return (
    <div className="animate-pulse">
      <div className="rounded-full bg-slate-500 h-12 w-12"></div>
    </div>
  );
};

const UserProfile = () => {
  return (
    <Menu parent={<ProfileButton />}>
      <MenuItem name="Profile" icon={<MdAccountCircle />} onClick={() => {}} />
      <MenuItem name="Sign Out" icon={<MdLogout />} onClick={() => signOut()} />
    </Menu>
  );
};

export default UserProfile;
