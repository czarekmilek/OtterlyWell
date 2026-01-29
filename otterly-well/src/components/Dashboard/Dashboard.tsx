import CaloriesWidget from "./components/CaloriesWidget";
import FitnessWidget from "./components/FitnessWidget";
import FinanceWidget from "./components/FinanceWidget";
import TasksWidget from "./components/TasksWidget";
import { useModuleContext } from "../../context/ModuleContext";
import { DashboardIcon } from "../icons";

const Dashboard = () => {
  const { visibleModules } = useModuleContext();

  const hasActiveModules = Object.values(visibleModules).some(Boolean);

  if (!hasActiveModules) {
    return (
      <div className="py-6 lg:p-8 mx-auto space-y-3 h-full xl:h-[calc(100vh)] flex flex-col">
        <div className="flex-grow overflow-hidden">
          <div className="flex flex-col items-center justify-center h-full text-brand-neutral-light/70 p-8 text-center bg-brand-neutral-dark/20 rounded-2xl border border-brand-depth border-dashed">
            <DashboardIcon className="opacity-50 mb-2" />
            <h3 className="text-xl font-bold mb-2 text-brand-neutral-light">
              Wszystkie moduły są ukryte
            </h3>
            <p className="max-w-md">
              Przejdź do menu bocznego i kliknij{" "}
              <strong>"Konfiguruj widok"</strong>, aby dodać widgety.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 h-full flex flex-col">
      <div className="columns-1 lg:columns-2 gap-3 sm:gap-6">
        {visibleModules.calories && (
          <div className="break-inside-avoid mb-3">
            <CaloriesWidget />
          </div>
        )}
        {visibleModules.fitness && (
          <div className="break-inside-avoid mb-3">
            <FitnessWidget />
          </div>
        )}
        {visibleModules.finance && (
          <div className="break-inside-avoid mb-3">
            <FinanceWidget />
          </div>
        )}
        {visibleModules.tasks && (
          <div className="break-inside-avoid mb-3">
            <TasksWidget />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
