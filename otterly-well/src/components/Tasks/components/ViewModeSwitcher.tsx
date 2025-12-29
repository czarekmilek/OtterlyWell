import { motion } from "framer-motion";

export type ViewMode = "active" | "completed" | "all";

interface ViewModeSwitcherProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

export function ViewModeSwitcher({
  currentMode,
  onModeChange,
}: ViewModeSwitcherProps) {
  const modes: { id: ViewMode; label: string }[] = [
    { id: "active", label: "Nieukończone" },
    { id: "all", label: "Wszystkie" },
    { id: "completed", label: "Ukończone" },
  ];

  return (
    <div className="flex w-full sm:w-auto bg-brand-neutral-dark/50 p-1 rounded-xl border border-brand-depth">
      {modes.map((mode) => {
        const isActive = currentMode === mode.id;
        return (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`relative flex-1 sm:flex-none px-2 sm:px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "text-brand-neutral-light"
                : "text-brand-neutral-light/60 hover:text-brand-neutral-light cursor-pointer"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="viewModeIndicator"
                className="absolute inset-0 bg-brand-secondary/80 rounded-lg shadow-sm z-10"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-20">{mode.label}</span>
          </button>
        );
      })}
    </div>
  );
}
