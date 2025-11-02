import { Fragment, useMemo } from "react";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import {
  CalorieIcon,
  DashboardIcon,
  FinanceIcon,
  TaskIcon,
  WorkoutIcon,
} from "../../icons";
import { useLocation, Link } from "react-router-dom";

const navigationItems = [
  { name: "Dashboard", to: "/", icon: DashboardIcon },
  { name: "Kalorie", to: "/calories", icon: CalorieIcon },
  { name: "Treningi", to: "#", icon: WorkoutIcon },
  { name: "Finanse", to: "#", icon: FinanceIcon },
  { name: "Zadania", to: "#", icon: TaskIcon },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const Sidebar = ({ mobileOpen, setMobileOpen }: SidebarProps) => {
  const { pathname } = useLocation();

  const navigation = useMemo(
    () =>
      navigationItems.map((item) => ({
        ...item,
        current:
          item.to !== "#" &&
          (item.to === "/" ? pathname === "/" : pathname.startsWith(item.to)),
      })),
    [pathname]
  );

  const sidebarContent = (
    <>
      <div className="flex shrink-0 items-center justify-center gap-x-4 px-6 h-16">
        <h1 className="text-2xl font-bold text-white">Otterly Well</h1>
      </div>
      <nav className="flex flex-1 flex-col gap-y-5 overflow-y-auto px-4">
        <ul role="list" className="flex flex-1 flex-col">
          <li>
            <ul role="list" className="space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  {item.to === "#" ? (
                    <div
                      className={classNames(
                        "text-gray-500 cursor-not-allowed",
                        "group flex gap-x-3 rounded-md p-3 text-sm font-semibold leading-6"
                      )}
                      aria-disabled
                      title="Wkrótce"
                    >
                      <item.icon
                        className="h-6 w-6 shrink-0"
                        aria-hidden="true"
                      />
                      {item.name}
                    </div>
                  ) : (
                    <Link
                      to={item.to}
                      className={classNames(
                        item.current
                          ? "bg-gray-800 text-white"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white",
                        "group flex gap-x-3 rounded-md p-3 text-sm font-semibold leading-6"
                      )}
                      aria-current={item.current ? "page" : undefined}
                      onClick={() => setMobileOpen(false)}
                    >
                      <item.icon
                        className="h-6 w-6 shrink-0"
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </>
  );

  return (
    <>
      {/* --- Mobile Sidebar (using Headless UI Dialog) --- */}
      <Transition show={mobileOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40 lg:hidden"
          onClose={setMobileOpen}
        >
          {/* Backdrop */}
          <TransitionChild
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </TransitionChild>

          <div className="fixed inset-0 flex">
            <TransitionChild
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <DialogPanel className="relative mr-16 flex w-full max-w-xs flex-1">
                {/* Close button */}
                <TransitionChild
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setMobileOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <span className="material-symbols-sharp h-6 w-6 text-white">
                        close
                      </span>
                    </button>
                  </div>
                </TransitionChild>

                <div className="flex grow flex-col overflow-y-auto bg-gray-900 ring-1 ring-white/10">
                  {sidebarContent}
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>

      {/* --- Desktop Sidebar --- */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-10 lg:flex lg:w-64 lg:flex-col border-r border-white/10 bg-gray-900">
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
