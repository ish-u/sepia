import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const useIsLoadingRoute = () => {
  const router = useRouter();
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  useEffect(() => {
    const handleStart = (url: string) => {
      console.log(`Loading: ${url}`);
      setIsLoadingRoute(true);
    };

    const handleStop = () => {
      setIsLoadingRoute(false);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);

  return { isLoadingRoute };
};
