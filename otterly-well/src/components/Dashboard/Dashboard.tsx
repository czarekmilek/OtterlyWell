import React from "react";
import { CalorieIcon, WorkoutIcon, FinanceIcon, TaskIcon } from "../icons";

interface TileData {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}

const modules: TileData[] = [
  {
    title: "Kalorie",
    description: "Lorem ipsum lorem ipsum.",
    icon: CalorieIcon,
    color: "text-orange-400",
    bgColor: "hover:bg-orange-400/10",
  },
  {
    title: "Treningi",
    description: "Lorem ipsum lorem ipsum.",
    icon: WorkoutIcon,
    color: "text-sky-400",
    bgColor: "hover:bg-sky-400/10",
  },
  {
    title: "Finanse",
    description: "Lorem ipsum lorem ipsum.",
    icon: FinanceIcon,
    color: "text-emerald-400",
    bgColor: "hover:bg-emerald-400/10",
  },
  {
    title: "Zadania",
    description: "Lorem ipsum lorem ipsum.",
    icon: TaskIcon,
    color: "text-violet-400",
    bgColor: "hover:bg-violet-400/10",
  },
];

const Dashboard = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Main Hub
        </h1>
        <p className="mt-4 text-xl text-gray-400">
          Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem
          ipsum
        </p>
      </header>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {modules.map((module) => (
          <div
            key={module.title}
            className={`group relative cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-gray-800/50 p-4 
              shadow-lg backdrop-blur-sm transition-all duration-300 ${module.bgColor} hover:border-gray-500/50 hover:shadow-2xl hover:-translate-y-1`}
          >
            <div className="flex items-center gap-4">
              <div className={`rounded-lg p-2 bg-gray-700/50 ${module.color}`}>
                <module.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-100">
                {module.title}
              </h3>
            </div>
            <p className="mt-4 text-gray-400">{module.description}</p>
            <div
              className={`absolute -bottom-12 -right-12 h-24 w-24 rounded-full opacity-10 blur-2xl transition-all duration-500 
                group-hover:scale-[3] ${module.color} bg-current`}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
