import { useState } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import type { TaskCategory } from "../../types/types";
import { CloseIcon } from "../../../icons";
import { TaskCategoryToggleRow } from "./components/TaskCategoryToggleRow";
import { TaskCategoryAddForm } from "./components/TaskCategoryAddForm";

interface TaskCategoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: TaskCategory[];
  onToggleCategory: (categoryId: string) => void;
  onAddCategory: (name: string) => void;
  onDeleteCategory: (categoryId: string) => void;
  onReorder: (newOrder: TaskCategory[]) => void;
  onEditCategory: (categoryId: string, name: string) => void;
}

export default function TaskCategoryManager({
  isOpen,
  onClose,
  categories,
  onToggleCategory,
  onAddCategory,
  onDeleteCategory,
  onReorder,
  onEditCategory,
}: TaskCategoryManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-neutral-darker/70 backdrop-blur-xs z-55"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-55 pointer-events-none"
          >
            <div
              className="overflow-hidden flex flex-col w-full max-w-lg max-h-[85vh] bg-brand-neutral-darker border border-brand-depth 
                          rounded-2xl shadow-2xl pointer-events-auto mx-4"
            >
              <div className="p-6 border-b border-brand-depth flex justify-between items-center bg-brand-neutral-dark/50">
                <h2 className="text-xl font-bold text-brand-neutral-light">
                  Aktywne kategorie
                </h2>
                <button
                  onClick={onClose}
                  className="text-brand-secondary hover:text-brand-neutral-dark hover:bg-brand-neutral-light/70 rounded-full 
                  p-1 flex items-center justify-center cursor-pointer transition-all"
                >
                  <CloseIcon />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="space-y-2">
                  {/* simplified version of categoryToggleRow from finance */}
                  <Reorder.Group
                    axis="y"
                    values={categories}
                    onReorder={onReorder}
                    className="space-y-2"
                  >
                    {categories.map((category) => (
                      <TaskCategoryToggleRow
                        key={category.id}
                        category={category}
                        isActive={category.is_active}
                        isEditMode={isEditMode}
                        onToggle={() => onToggleCategory(category.id)}
                        onDelete={() => onDeleteCategory(category.id)}
                        onEdit={(name) => onEditCategory(category.id, name)}
                      />
                    ))}
                  </Reorder.Group>
                </div>

                {isAdding ? (
                  <TaskCategoryAddForm
                    onAdd={(name) => {
                      onAddCategory(name);
                      setIsAdding(false);
                    }}
                    onCancel={() => setIsAdding(false)}
                  />
                ) : (
                  <button
                    onClick={() => setIsAdding(true)}
                    className="w-full mt-2  py-2 border border-dashed border-brand-neutral-light/30 rounded-xl
                                 text-brand-neutral-light/60 hover:text-brand-neutral-light hover:border-brand-neutral-light/60
                                 transition-all cursor-pointer"
                  >
                    + Dodaj nową kategorię
                  </button>
                )}
                {/* TODO: maybe move to another place */}
                <button
                  onClick={() => setIsEditMode(!isEditMode)}
                  className={`w-full px-4 rounded-lg transition-all duration-200 cursor-pointer ${
                    isEditMode
                      ? "text-brand-accent-1 hover:text-brand-accent-1/80 hover:underline"
                      : "text-brand-accent-1 hover:text-brand-accent-1/80 hover:underline"
                  }`}
                  title={
                    isEditMode
                      ? "Zakończ tryb edycji"
                      : "Włącz tryb edycji i usuwania"
                  }
                >
                  <span>{isEditMode ? "Zakończ edycję" : "Tryb edycji"}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
