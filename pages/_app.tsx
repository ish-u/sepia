import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { AppProvider } from "../context/context";
import Layout from "../components/layout";
import type { NextComponentType } from "next"; //Import Component type
import { Session } from "next-auth";

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
      <AppProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AppProvider>
    </SessionProvider>
  );
}

export default MyApp;
