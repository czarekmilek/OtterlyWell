import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "../lib/supabaseClient";

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
  const { user } = useAuth();
  const [visibleModules, setVisibleModules] = useState<
    Record<ModuleType, boolean>
  >(() => {
    const saved = localStorage.getItem("visibleModules");
    return saved ? JSON.parse(saved) : defaultModules;
  });

  // Loading preferences from DB when user logs in
  useEffect(() => {
    async function loadPreferences() {
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("preferences")
        .eq("id", user.id)
        .single();

      if (data?.preferences && (data.preferences as any).visibleModules) {
        const dbModules = (data.preferences as any).visibleModules;
        setVisibleModules(dbModules);
        localStorage.setItem("visibleModules", JSON.stringify(dbModules));
      }
    }

    loadPreferences();
  }, [user]);

  // still saving to LocalStorage immediately when changes happen just in case
  useEffect(() => {
    localStorage.setItem("visibleModules", JSON.stringify(visibleModules));
  }, [visibleModules]);

  const toggleModule = async (module: ModuleType) => {
    const newModules = {
      ...visibleModules,
      [module]: !visibleModules[module],
    };

    setVisibleModules(newModules);

    if (user) {
      const { data: currentData } = await supabase
        .from("profiles")
        .select("preferences")
        .eq("id", user.id)
        .single();

      const currentPrefs = currentData?.preferences || {};

      await supabase.from("profiles").upsert({
        id: user.id,
        preferences: {
          ...currentPrefs,
          visibleModules: newModules,
        },
        updated_at: new Date(),
      });
    }
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
