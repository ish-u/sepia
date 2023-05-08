import {
  ReactElement,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from "react";

const MenuButton = ({
  element,
  onClick,
}: {
  element: ReactElement;
  onClick: () => void;
}) => {
  return (
    <>
      {isValidElement(element) &&
        cloneElement(element, {
          // @ts-ignore
          onClick: onClick,
        })}
    </>
  );
};

export const Menu = ({
  parent,
  children,
}: {
  parent: ReactElement;
  children: ReactElement[];
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleMenu = () => setShowUserMenu(!showUserMenu);
  const closeUserMenu = () => setShowUserMenu(false);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      menuRef.current &&
      event.target &&
      !menuRef.current.contains(event.target as HTMLElement)
    ) {
      closeUserMenu();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="static" ref={menuRef}>
      <MenuButton element={parent} onClick={toggleMenu} />
      {showUserMenu && (
        <>
          <div className="absolute right-4 bottom-2 border-l-[8px] border-r-[8px]  border-b-[12px] border-r-transparent border-l-transparent border-b-slate-500"></div>
          <div className="mt-2 w-32 max-w-32 right-0 absolute border bg-slate-500 border-gray-500 rounded-md">
            {children}
          </div>
        </>
      )}
    </div>
  );
};
