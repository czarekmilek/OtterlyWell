import React, { createContext, useContext, useState, useEffect } from "react";

export type ModuleType = "calories" | "fitness" | "finance" | "tasks";

interface ModuleContextType {
  visibleModules: Record<ModuleType, boolean>;
  toggleModule: (module: ModuleType) => void;
}

const defaultModules: Record<ModuleType, boolean> = {
  calories: true,
  fitness: true,
  finance: true,
  tasks: true,
};

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

export function ModuleProvider({ children }: { children: React.ReactNode }) {
  const [visibleModules, setVisibleModules] = useState<
    Record<ModuleType, boolean>
  >(() => {
    const saved = localStorage.getItem("visibleModules");
    return saved ? JSON.parse(saved) : defaultModules;
  });

  useEffect(() => {
    localStorage.setItem("visibleModules", JSON.stringify(visibleModules));
  }, [visibleModules]);

  const toggleModule = (module: ModuleType) => {
    setVisibleModules((prev) => ({
      ...prev,
      [module]: !prev[module],
    }));
  };

  return (
    <ModuleContext.Provider value={{ visibleModules, toggleModule }}>
      {children}
    </ModuleContext.Provider>
  );
}

export function useModuleContext() {
  const context = useContext(ModuleContext);
  if (context === undefined) {
    throw new Error("useModuleContext must be used within a ModuleProvider");
  }
  return context;
}
