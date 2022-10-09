import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { AppProvider } from "../context/context";
import Layout from "../components/layout";
import { Session } from "next-auth";
import Head from "next/head";

type ExtendedAppProps = AppProps & {
  pageProps: {
    session: Session;
  };
};

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: ExtendedAppProps) {
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
          <Component {...pageProps} />
        </Layout>
      </AppProvider>
    </SessionProvider>
  );
}

export default MyApp;
