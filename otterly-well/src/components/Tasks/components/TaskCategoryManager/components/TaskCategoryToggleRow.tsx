import { motion } from "framer-motion";

import { TrashIcon } from "../../../../icons";

interface TaskCategoryToggleRowProps {
  name: string;
  isActive: boolean;
  isDeleteMode: boolean;
  onToggle: (newState: boolean) => void;
  onDelete: () => void;
}

// A bit simplifeid version of CategoryToggleRow from Finance
// basically, just no icons and colors
export function TaskCategoryToggleRow({
  name,
  isActive,
  isDeleteMode,
  onToggle,
  onDelete,
}: TaskCategoryToggleRowProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-brand-neutral-dark/30 rounded-xl border border-brand-depth/50">
      <div className="flex items-center gap-3">
        <span className="font-medium text-sm md:text-base text-brand-neutral-light">
          {name}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {isDeleteMode ? (
          <button
            onClick={onDelete}
            // TODO: adjust later
            className="p-3 h-4 text-brand-negative hover:text-brand-negative/80 transition-colors flex items-center justify-center 
                    rounded-md hover:bg-brand-negative/10 cursor-pointer"
            title="Delete Category"
          >
            <TrashIcon className="!text-[20px]" />
          </button>
        ) : (
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
        )}
      </div>
    </div>
  );
}
