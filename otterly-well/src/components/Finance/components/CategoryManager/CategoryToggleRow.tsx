import { motion } from "framer-motion";
import { getCategoryColor } from "../../constants/categoryColors";
import { getCategoryIcon } from "../../constants/categoryIcons";

interface CategoryToggleRowProps {
  name: string;
  isActive: boolean;
  onToggle: (newState: boolean) => void;
}

export function CategoryToggleRow({
  name,
  isActive,
  onToggle,
}: CategoryToggleRowProps) {
  const color = getCategoryColor(name);
  const icon = getCategoryIcon(name);

  return (
    <div className="flex items-center justify-between p-3 bg-brand-neutral-dark/30 rounded-xl border border-brand-depth/50">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-brand-primary-dark"
          style={{ backgroundColor: color }}
        >
          <span className="material-symbols-sharp">{icon}</span>
        </div>
        <span className="font-medium text-sm md:text-base text-brand-neutral-light">
          {name}
        </span>
      </div>

      <button
        onClick={() => onToggle(!isActive)}
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 ease-in-out cursor-pointer ${
          isActive ? "bg-brand-accent-1" : "bg-brand-neutral-dark"
        }`}
      >
        <motion.div
          initial={false}
          animate={{ x: isActive ? 26 : 7 }}
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
        />
      </button>
    </div>
  );
}
