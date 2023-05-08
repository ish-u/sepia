import Image from "next/image";
import { useEffect } from "react";
import { useSepiaStore } from "../../store/store";
import PlayerControls from "./PlayerControls";
import SeekBar from "./SeekBar";
const FullScreen = ({
  show,
  setShow,
}: {
  show: boolean;
  setShow: (value: boolean) => void;
}) => {
  const track = useSepiaStore((state) => state.track);
  const player = useSepiaStore((state) => state.player);
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflowY = "scroll";
    };
  }, [show]);

  return (
    <>
      {show && track && player && (
        <>
          <div className="animate-gradient fixed top-0 left-0 flex flex-col md:block w-full h-full bg-gradient-to-r from-slate-500 to-red-500">
            <div className="h-4/6 w-full md:w-5/6 flex flex-col justify-end md:flex-row md:m-auto">
              <div className="w-full md:w-1/4 h-4/6 md:h-full flex justify-center md:justify-end items-center md:items-end px-20 md:p-4">
                <Image
                  objectFit="contain"
                  height={track.album.images[2].height ?? undefined}
                  width={track.album.images[2].width ?? undefined}
                  src={track.album.images[2].url}
                  alt="Cover"
                ></Image>
              </div>
              <div className="w-full md:w-3/4 md:h-full flex flex-col justify-end px-20 py-8 md:p-4">
                <div className="text-4xl md:text-6xl pb-2 md:pb-4 font-bold  break-words">
                  {track.name}
                </div>
                <div className="text-xl md:text-3xl">
                  {track.artists.map((artist) => artist.name).toString()}
                </div>
              </div>
            </div>
            <div className="h-2/6 w-full flex flex-col">
              <div className="my-8 mx-16 md:mx-32">
                <SeekBar />
              </div>
              <PlayerControls fullscreen={true} />
            </div>
          </div>
          <div
            onClick={() => {
              setShow(false);
            }}
            className="fixed top-0 right-0 p-2 hover:bg-stone-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </div>
        </>
      )}
    </>
  );
};

export default FullScreen;
