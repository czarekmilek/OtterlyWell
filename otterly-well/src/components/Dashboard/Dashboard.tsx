import React from "react";
import { CalorieIcon, WorkoutIcon, FinanceIcon, TaskIcon } from "../icons";
import { Link } from "react-router-dom";

interface TileData {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  to?: string;
}

const modules: TileData[] = [
  {
    title: "Kalorie",
    description: "Lorem ipsum lorem ipsum.",
    icon: CalorieIcon,
    color: "text-brand-accent-1",
    bgColor: "hover:bg-brand-accent-1/10",
    to: "/calories",
  },
  {
    title: "Treningi",
    description: "Lorem ipsum lorem ipsum.",
    icon: WorkoutIcon,
    color: "text-brand-primary",
    bgColor: "hover:bg-brand-primary/10",
    to: "/fitness",
  },
  {
    title: "Finanse",
    description: "Lorem ipsum lorem ipsum.",
    icon: FinanceIcon,
    color: "text-brand-accent-2",
    bgColor: "hover:bg-brand-accent-2/10",
  },
  {
    title: "Zadania",
    description: "Lorem ipsum lorem ipsum.",
    icon: TaskIcon,
    color: "text-brand-accent-3",
    bgColor: "hover:bg-brand-accent-3/10",
  },
];

const Card = ({ data }: { data: TileData }) => {
  const content = (
    <div
      className={`group relative overflow-hidden rounded-xl border border-brand-depth bg-brand-neutral-dark/50 p-4 
      shadow-lg backdrop-blur-sm transition-all duration-300 ${data.bgColor} hover:border-brand-depth/50 hover:shadow-2xl hover:-translate-y-1`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`rounded-lg p-2 bg-brand-neutral-dark/50 ${data.color}`}
        >
          <data.icon className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-semibold text-brand-neutral-light">
          {data.title}
        </h3>
      </div>
      <p className="mt-4 text-brand-secondary">{data.description}</p>
      <div
        className={`absolute -bottom-12 -right-12 h-24 w-24 rounded-full opacity-10 blur-2xl transition-all duration-500 
          group-hover:scale-[3] ${data.color} bg-current`}
      ></div>
    </div>
  );

  return data.to ? (
    <Link to={data.to} className="cursor-pointer">
      {content}
    </Link>
  ) : (
    <div className="cursor-not-allowed opacity-80" title="Wkrótce">
      {content}
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-brand-neutral-dark sm:text-5xl">
          Main Hub
        </h1>
        <p className="mt-4 text-xl text-brand-neutral-dark">
          Zarządzaj modułami: Kalorie, Treningi, Finanse, Zadania.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {modules.map((module) => (
          <Card key={module.title} data={module} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
