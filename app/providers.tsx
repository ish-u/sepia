"use client";

import { SessionProvider } from "next-auth/react";
import { ReactElement } from "react";
import Layout from "../components/Layout";

type Props = {
  children: ReactElement;
};

export const NextAuthProvider = ({ children }: Props) => {
  return (
    <SessionProvider>
      <Layout>{children}</Layout>
    </SessionProvider>
  );
};
