import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Task, TaskCategory, TaskPriority } from "../types/types";
import { CloseIcon } from "../../icons";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, "id" | "created_at" | "is_completed">) => void;
  categories: TaskCategory[];
  initialData?: Task;
}

export function AddTaskModal({
  isOpen,
  onClose,
  onSubmit,
  categories,
  initialData,
}: AddTaskModalProps) {
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [categoryId, setCategoryId] = useState(
    initialData?.category_id || categories[0]?.id || "",
  );
  const [priority, setPriority] = useState<TaskPriority>(
    initialData?.priority || 1,
  );
  const [deadline, setDeadline] = useState(
    initialData?.deadline
      ? new Date(initialData.deadline).toISOString().split("T")[0]
      : "",
  );

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setDescription(initialData.description);
        setCategoryId(initialData.category_id);
        setPriority(initialData.priority);
        setDeadline(
          initialData.deadline
            ? new Date(initialData.deadline).toISOString().split("T")[0]
            : "",
        );
      } else if (categories.length > 0) {
        if (!description && !initialData) {
          const isCurrentCategoryValid = categories.some(
            (c) => c.id === categoryId,
          );
          if (!categoryId || !isCurrentCategoryValid) {
            setCategoryId(categories[0].id);
          }
        }
      }
    }
    // if no initialData we are creatin new task, not editing old one - so we reset state
    if (isOpen && !initialData && !description) {
      setPriority(1);
      setDeadline("");
    }
  }, [isOpen, categories, categoryId, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !categoryId) return;

    onSubmit({
      description,
      category_id: categoryId,
      priority,
      deadline: deadline ? new Date(deadline).toISOString() : undefined,
    });

    if (!initialData) {
      setDescription("");
      setPriority(1);
      setDeadline("");
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-neutral-darker/70 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="w-full max-w-lg bg-brand-neutral-darker border border-brand-depth rounded-2xl shadow-2xl pointer-events-auto mx-4 overflow-hidden">
              <div className="p-6 border-b border-brand-depth flex justify-between items-center bg-brand-neutral-dark/50">
                <h2 className="text-xl font-bold text-brand-neutral-light">
                  {initialData ? "Edytuj zadanie" : "Dodaj nowe zadanie"}
                </h2>
                <button
                  onClick={onClose}
                  className="text-brand-secondary hover:text-brand-neutral-dark hover:bg-brand-neutral-light/70 rounded-full 
                  p-1 flex items-center justify-center cursor-pointer transition-all"
                >
                  <CloseIcon />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-neutral-light/80 mb-1">
                    Treść zadania
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-brand-neutral-dark/40 border border-brand-depth rounded-xl 
                                         text-brand-neutral-light placeholder-brand-neutral-light/30 focus:outline-none focus:border-brand-primary"
                    placeholder="Co musisz zrobić?"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-neutral-light/80 mb-1">
                      Kategoria
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full px-4 py-2.5 bg-brand-neutral-dark/40 border border-brand-depth rounded-xl 
                                             text-brand-neutral-light focus:outline-none focus:border-brand-primary"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-neutral-light/80 mb-1">
                      Priorytet
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriority(p as TaskPriority)}
                          className={`flex-1 py-2.5 rounded-xl border transition-all font-bold text-sm
                                                ${
                                                  priority === p
                                                    ? p === 3
                                                      ? "bg-brand-negative text-white border-brand-negative"
                                                      : p === 2
                                                        ? "bg-brand-accent-3 text-white border-brand-accent-3"
                                                        : "bg-brand-accent-2 text-white border-brand-accent-2"
                                                    : "border-brand-depth text-brand-neutral-light/60 hover:border-brand-neutral-light/40"
                                                }`}
                        >
                          {p === 3 ? "!!!" : p === 2 ? "!!" : "!"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-neutral-light/80 mb-1">
                    Termin (opcjonalnie)
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-4 py-2.5 bg-brand-neutral-dark/40 border border-brand-depth rounded-xl 
                                         text-brand-neutral-light focus:outline-none focus:border-brand-primary [color-scheme:dark]"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-3 bg-brand-primary rounded-xl text-brand-neutral-light font-bold 
                                         hover:bg-brand-primary/90 transition-all shadow-lg active:scale-97 cursor-pointer"
                  >
                    {initialData ? "Zapisz zmiany" : "Dodaj zadanie"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
