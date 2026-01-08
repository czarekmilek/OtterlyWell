import React from "react";
import CaloriesWidget from "./components/CaloriesWidget";
import FitnessWidget from "./components/FitnessWidget";
import FinanceWidget from "./components/FinanceWidget";
import TasksWidget from "./components/TasksWidget";
import { useModuleContext } from "../../context/ModuleContext";

const Dashboard = () => {
  const { visibleModules } = useModuleContext();

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

      {!Object.values(visibleModules).some(Boolean) && (
        <div
          className="flex flex-col items-center justify-center p-12 text-center bg-brand-neutral-dark/10 
                  rounded-3xl border-2 border-dashed border-brand-depth"
        >
          <p className="text-brand-neutral-dark font-medium text-lg">
            Wszystkie moduły są ukryte.
          </p>
          <p className="text-brand-primary text-sm mt-2">
            Przejdź do menu bocznego i kliknij "Konfiguruj widok", aby dodać
            widgety.
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
