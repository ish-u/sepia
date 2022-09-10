import React from "react";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";

const Library = () => {
  return <div className="mx-32 my-4">Library</div>;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  return {
    props: {},
  };
}
export default Library;
