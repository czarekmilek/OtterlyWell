import { MenuIcon } from "../../icons";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  return (
    <div className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-x-6 border-b border-white/10 bg-gray-900 px-4 shadow-sm sm:px-6 lg:px-8">
      {/* Mobile-only menu button */}
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-400 lg:hidden"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <MenuIcon className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />

      {/* <div className="flex flex-1 justify-end gap-x-6">
        <div className="flex items-center gap-x-4">
          <span className="sr-only">View profile</span>
          <img
            className="h-8 w-8 rounded-full bg-gray-800"
            src="https://via.placeholder.com/150"
            alt=""
          />
        </div>
      </div> */}
    </div>
  );
};

export default Header;
