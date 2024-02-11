import NextImage from "next/image";
import { useEffect, useState } from "react";
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
  const [gradient, setGradient] = useState("");
  const [textColor, setTextColor] = useState("");

  function getContrastColor(r: number, g: number, b: number) {
    // Calculate the relative luminance (brightness) of the color
    // using the formula for relative luminance given by W3C
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Choose white or black depending on the luminance
    return luminance > 0.5 ? "#000000" : "#FFFFFF";
  }

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflowY = "scroll";
    };
  }, [show]);

  useEffect(() => {
    if (track?.album.images[2].url) {
      const imageUrl = track?.album.images[2].url;
      const image = new Image();
      image.src = imageUrl;
      image.crossOrigin = "Anonymous";

      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = image.width;
        canvas.height = image.height;
        if (ctx) {
          ctx.drawImage(image, 0, 0, image.width, image.height);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const colorMap: { [key: string]: number } = {};

          for (let i = 0; i < imageData.data.length; i += 4) {
            const r = imageData.data[i];
            const g = imageData.data[i + 1];
            const b = imageData.data[i + 2];
            const color = `rgb(${r},${g},${b})`;
            if (colorMap[color]) {
              colorMap[color] += 1;
            } else {
              colorMap[color] = 1;
            }
          }

          let colors: [string, number][] = [];
          for (let color in colorMap) {
            colors.push([color, colorMap[color]]);
          }
          colors.sort(function (a, b) {
            return b[1] - a[1];
          });

          const topColor = colors[0][0];
          let gradient = "linear-gradient(to top left, ";
          const steps = 10;
          for (let i = 0; i < steps; i += 1) {
            const startPercentage = ((i * 1) / steps) * 100;
            const index = Math.floor((startPercentage * colors.length) / 100);
            console.log(index);
            gradient += `${colors[index][0]} ${startPercentage}%, `;
          }
          gradient += "#FFDCCC)";
          setGradient(gradient);
          const endRGB = topColor
            .split("(")[1]
            ?.split(")")[0]
            .split(",")
            .map((x) => parseInt(x));
          setTextColor(getContrastColor(endRGB[0], endRGB[1], endRGB[2]));
        }
      };
    }
  }, [track]);

  return (
    <>
      {show && track && player && (
        <>
          <div
            className="animate-gradient fixed -top-1/2 -left-1/2 flex flex-col md:block w-[200%] h-[200%]"
            style={{
              backgroundImage: gradient,
            }}
          ></div>
          <div className="fixed top-0 left-0 flex flex-col md:block w-full h-full">
            <div className="h-4/6 w-full md:w-5/6 flex flex-col justify-end md:flex-row md:m-auto">
              <div className="w-full md:w-1/4 h-4/6 md:h-full flex justify-center md:justify-end items-center md:items-end px-20 md:p-4">
                <NextImage
                  objectFit="contain"
                  height={track.album.images[2].height ?? undefined}
                  width={track.album.images[2].width ?? undefined}
                  src={track.album.images[2].url}
                  alt="Cover"
                ></NextImage>
              </div>
              <div
                className="w-full md:w-3/4 md:h-full flex flex-col justify-end px-20 py-8 md:p-4"
                style={{
                  color: textColor,
                }}
              >
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
                <SeekBar
                  style={{
                    color: textColor,
                  }}
                />
              </div>
              <PlayerControls
                fullscreen={true}
                style={{
                  color: textColor,
                }}
              />
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
