import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloseIcon, SearchIcon, CalendarIcon } from "../../../icons";
import { useRef, useEffect } from "react";
import type { Task, TaskCategory } from "../../types/types";
import { HistoricalTaskRow } from "./HistoricalTaskRow";
import CustomSelect from "../../../UI/CustomSelect";
import { DateSelector } from "../../../UI/DateSelector";
import ConfirmDeleteDialog from "../../../UI/ConfirmDeleteDialog";

interface HistoricalTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  categories: TaskCategory[];
  onRestore: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

export default function HistoricalTaskModal({
  isOpen,
  onClose,
  tasks,
  categories,
  onRestore,
  onDelete,
}: HistoricalTaskModalProps) {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isMonthSelectorOpen, setIsMonthSelectorOpen] = useState(false);
  const monthSelectorRef = useRef<HTMLDivElement>(null);

  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        monthSelectorRef.current &&
        !monthSelectorRef.current.contains(event.target as Node)
      ) {
        setIsMonthSelectorOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const historicalTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        //  we want only dismissed before tasks
        if (!t.is_completed && !t.is_dismissed) return false;
        if (!t.is_dismissed) return false;

        const completedDate = t.completed_at ? new Date(t.completed_at) : null;
        if (!completedDate) return false;

        const isSameMonth =
          completedDate.getMonth() === selectedDate.getMonth() &&
          completedDate.getFullYear() === selectedDate.getFullYear();

        if (!isSameMonth) return false;

        if (
          selectedCategoryId !== "all" &&
          t.category_id !== selectedCategoryId
        )
          return false;

        if (
          searchQuery &&
          !t.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
          return false;

        return true;
      })
      .sort((a, b) => {
        const tA = a.completed_at ? new Date(a.completed_at).getTime() : 0;
        const tB = b.completed_at ? new Date(b.completed_at).getTime() : 0;
        return tB - tA;
      });
  }, [tasks, selectedDate, selectedCategoryId, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedTaskId((prev) => (prev === id ? null : id));
  };

  const categoryOptions = [
    { label: "Wszystkie kategorie", value: "all" },
    ...categories.map((c) => ({ label: c.name, value: c.id })),
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-neutral-darker/70 h-full backdrop-blur-xs z-55"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-55 pointer-events-none"
          >
            <div
              className="overflow-hidden flex flex-col w-full max-w-4xl max-h-[85vh] bg-brand-neutral-darker border border-brand-depth 
                          rounded-2xl shadow-2xl pointer-events-auto mx-4"
            >
              <div className="p-6 border-b border-brand-depth flex justify-between items-center bg-brand-neutral-dark/50">
                <h2 className="text-xl font-bold text-brand-neutral-light">
                  Historia zadań
                </h2>
                <button
                  onClick={onClose}
                  className="text-brand-secondary hover:text-brand-neutral-dark hover:bg-brand-neutral-light/70 rounded-full 
                  p-1 flex items-center justify-center cursor-pointer transition-all"
                >
                  <CloseIcon className="w-6 h-6" />
                </button>
              </div>

              <div
                className="p-4 border-b border-brand-depth/50 bg-brand-neutral-dark/20 flex flex-col md:flex-row gap-4"
                ref={monthSelectorRef}
              >
                <div className="flex-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-brand-neutral-light/50">
                      <SearchIcon className="scale-88" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Szukaj zadania..."
                      className="block w-full pl-10 pr-3 py-2.5 border border-brand-depth rounded-lg bg-brand-neutral-dark 
                                text-brand-neutral-light placeholder-brand-neutral-light/30 focus:outline-none focus:ring-1
                                focus:ring-brand-accent-1"
                    />
                  </div>
                </div>
                {/* this whole thing is a bit of a mess, but kind of works */}
                <AnimatePresence mode="wait">
                  {!isMonthSelectorOpen ? (
                    <motion.div
                      key="category-selector"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="w-full md:w-77 flex gap-2 items-start relative"
                    >
                      <div className="flex-1">
                        <CustomSelect
                          value={selectedCategoryId}
                          onChange={setSelectedCategoryId}
                          options={categoryOptions}
                          placeholder="Kategoria"
                        />
                      </div>
                      <button
                        onClick={() =>
                          setIsMonthSelectorOpen(!isMonthSelectorOpen)
                        }
                        className={`p-3 rounded-lg border transition-colors flex items-center justify-center shrink-0
                             ${
                               isMonthSelectorOpen
                                 ? "bg-brand-neutral-dark border-brand-accent-1 text-brand-accent-1"
                                 : "bg-brand-neutral-dark border-brand-depth text-brand-neutral-light hover:border-brand-neutral-light/30"
                             }`}
                      >
                        <CalendarIcon />
                      </button>
                    </motion.div>
                  ) : (
                    // {/* month selector appears over the modal only after clicking the calendar button - no need for swticher in the UI directly */}
                    // {/* TODO: make it relative, maybe create a new component for selecting just a month and year */}
                    <motion.div
                      key="date-selector"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <DateSelector
                        selectedDate={selectedDate}
                        onDateChange={setSelectedDate}
                        format="month"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex-1 overflow-y-auto md:p-6 p-4 space-y-4">
                {historicalTasks.length === 0 ? (
                  <div className="text-center text-brand-neutral-light/40 py-10 flex flex-col items-center gap-2">
                    <span className="material-symbols-sharp text-4xl opacity-50">
                      inbox
                    </span>
                    <span>Brak zadań w historii dla wybranych kryteriów.</span>
                  </div>
                ) : (
                  historicalTasks.map((task) => (
                    <HistoricalTaskRow
                      key={task.id}
                      task={task}
                      category={categories.find(
                        (c) => c.id === task.category_id
                      )}
                      isExpanded={expandedTaskId === task.id}
                      onClick={() => toggleExpand(task.id)}
                      onRestore={onRestore}
                      onDelete={(id) => setTaskToDelete(id)}
                    />
                  ))
                )}
              </div>

              <div className="p-4 border-t border-brand-depth bg-brand-neutral-dark/30 text-center">
                <p className="text-xs text-brand-neutral-light/50">
                  Historyczne zadania można przywrócić do listy aktywnych za
                  pomocą przycisku.
                </p>
              </div>
            </div>
          </motion.div>

          <ConfirmDeleteDialog
            isOpen={!!taskToDelete}
            onClose={() => setTaskToDelete(null)}
            onConfirm={() => {
              if (taskToDelete) {
                onDelete(taskToDelete);
                setTaskToDelete(null);
              }
            }}
            title="Usuń zadanie"
            description="Czy na pewno chcesz trwale usunąć to zadanie? Tej operacji nie można cofnąć."
            confirmLabel="Usuń zadanie"
          />
        </>
      )}
    </AnimatePresence>
  );
}
