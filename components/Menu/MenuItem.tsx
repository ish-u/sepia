import { ReactNode } from "react";

export const MenuItem = ({
  name,
  onClick,
  icon,
}: {
  name: string;
  onClick: () => void;
  icon?: ReactNode;
}) => {
  return (
    <div
      onClick={(e) => {
        onClick();
        e.stopPropagation();
      }}
      className="flex items-center bg-slate-500 p-2 my-1 text-sm m-0.5 text-white hover:bg-slate-700 rounded-md duration-150 ease-in-out"
    >
      <div className="text-lg mr-2">{icon}</div>
      <div>{name}</div>
    </div>
  );
};
