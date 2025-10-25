import {
  CalorieIcon,
  DashboardIcon,
  FinanceIcon,
  TaskIcon,
  WorkoutIcon,
} from "../../icons";

const navigation = [
  { name: "Dashboard", href: "#", icon: DashboardIcon, current: true },
  { name: "Kalorie", href: "#", icon: CalorieIcon, current: false },
  { name: "Treningi", href: "#", icon: WorkoutIcon, current: false },
  { name: "Finanse", href: "#", icon: FinanceIcon, current: false },
  { name: "Zadania", href: "#", icon: TaskIcon, current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Sidebar = () => {
  return (
    <aside className="fixed z-10 flex w-64 flex-col border-r border-white/10 bg-gray-900">
      <div className="flex items-center justify-center px-6 h-16">
        <h1 className="text-2xl font-bold text-white">Otterly Well</h1>
      </div>
      <nav className="flex flex-1 flex-col gap-y-5 overflow-y-auto px-4">
        <ul role="list" className="flex flex-1 flex-col">
          <li>
            <ul role="list" className="space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={classNames(
                      item.current
                        ? "bg-gray-800 text-white"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white",
                      "group flex gap-x-3 rounded-md p-3 text-sm font-semibold leading-6"
                    )}
                    aria-current={item.current ? "page" : undefined}
                  >
                    <item.icon
                      className="h-6 w-6"
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
