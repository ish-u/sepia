"use client";

import Link from "next/link";

const Error = ({ error, reset }: { error: Error; reset: () => void }) => {
  return (
    <div className="flex flex-col mt-8 pb-24">
      <div className="mx-auto font-bold text-lg">{error.message}</div>
      <div className="mx-auto underline">
        <Link href="/">home</Link>
      </div>
    </div>
  );
};

export default Error;
