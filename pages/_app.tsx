import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import Layout from "../components/Layout";
import { Loader } from "../components/Loader";
import { AppProvider } from "../context/context";
import { useIsLoadingRoute } from "../hooks/useLoading";
import "../styles/globals.css";

type ExtendedAppProps = AppProps & {
  pageProps: {
    session: Session;
  };
};

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: ExtendedAppProps) {
  const { isLoadingRoute } = useIsLoadingRoute();

  return (
    <SessionProvider session={session}>
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <title>sepia</title>
      </Head>
      <AppProvider>
        <Layout>
          {isLoadingRoute ? <Loader /> : <Component {...pageProps} />}
        </Layout>
      </AppProvider>
    </SessionProvider>
  );
}

export default MyApp;
