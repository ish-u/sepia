import { getProviders, signIn } from "next-auth/react";
import { InferGetServerSidePropsType } from "next";
import Image from "next/image";

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  console.log("HERE");
  return (
    <>
      {providers
        ? Object.values(providers).map((provider) => (
            <div
              className="w-screen h-screen flex justify-center items-center"
              key={provider.name}
            >
              <button
                className="text-white drop-shadow-xl text-lg flex flex-row items-center justify-center align-middle px-4 py-2 my-2 bg-black rounded-full"
                onClick={() =>
                  signIn(provider.id, { callbackUrl: "http://localhost:3000/" })
                }
              >
                <Image
                  height="32px"
                  width="32px"
                  src="/Spotify_Icon_RGB_Green.png"
                  alt="Spotify Logo"
                ></Image>
                <span className="font-thin ml-2">
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
