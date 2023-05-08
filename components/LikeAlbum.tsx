"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { isAlbumLiked, likeAlbum, unlikeAlbum } from "../library/spotify";

const LikeAlbum = ({ albumId }: { albumId: string }) => {
  const { data: session } = useSession();
  useEffect(() => {
    if (session?.accessToken) {
      (async () => {
        const isLiked = (await isAlbumLiked(session?.accessToken, albumId))[0];
        setLiked(isLiked);
      })();
    }
  }, [session?.accessToken, albumId]);
  const [liked, setLiked] = useState(false);
  const toggleLiked = async () => {
    if (liked) {
      await unlikeAlbum(session?.accessToken || "", albumId);
      setLiked(false);
    } else {
      await likeAlbum(session?.accessToken || "", albumId);
      setLiked(true);
    }
  };
  return (
    <div className="mx-5 text-4xl" onClick={toggleLiked}>
      {liked ? <MdFavorite /> : <MdFavoriteBorder />}
    </div>
  );
};

export default LikeAlbum;
