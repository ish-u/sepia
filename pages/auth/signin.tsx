import { getProviders, signIn } from "next-auth/react";
import { InferGetServerSidePropsType } from "next";
import Image from "next/image";
import SPotifyIcon from "../../public/Spotify_Icon_RGB_Green.png";
export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      {providers
        ? Object.values(providers).map((provider) => (
            <div
              className="w-full h-full flex flex-col justify-center items-center"
              key={provider.name}
            >
              <div className="text-9xl p-32 font-semibold">sepia</div>
              <button
                className="text-white drop-shadow-xl text-2xl flex flex-row items-center justify-center align-middle p-4 my-2 hover:scale-105 duration-150 ease-in-out bg-black rounded-full"
                onClick={() =>
                  signIn(provider.id, {
                    callbackUrl: "/",
                  })
                }
              >
                <Image
                  height="44px"
                  width="44px"
                  src={SPotifyIcon}
                  alt="Spotify Logo"
                ></Image>
                <span className="font-semibold ml-4 mr-2">
                  Sign in with {provider.name}
                </span>
              </button>
            </div>
          ))
        : ""}
    </>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}
