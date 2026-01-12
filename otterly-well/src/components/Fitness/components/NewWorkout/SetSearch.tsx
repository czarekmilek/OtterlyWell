import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWorkoutSets } from "../../hooks/useWorkoutSets";
import { SearchIcon, EditIcon, DeleteIcon } from "../../../icons";
import type { ExerciseSet } from "../../types/types";
import SetModal from "./SetModal";
import ConfirmDeleteDialog from "../../../UI/ConfirmDeleteDialog";

interface SetSearchProps {
  onAddSet: (set: ExerciseSet) => void;
  onCreateSet: () => void;
}

export default function SetSearch({ onAddSet, onCreateSet }: SetSearchProps) {
  const [query, setQuery] = useState("");
  const { loading, sets, error, refreshSets, deleteSet } =
    useWorkoutSets(query);
  const [selectedSet, setSelectedSet] = useState<ExerciseSet | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleAdd = () => {
    if (selectedSet) {
      onAddSet(selectedSet);
      setSelectedSet(null);
      setQuery("");
    }
  };

  const handleDelete = async () => {
    if (selectedSet) {
      try {
        await deleteSet(selectedSet.id);
        setSelectedSet(null);
        setIsDeleteModalOpen(false);
      } catch (err) {
        console.error("Failed to delete set", err);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-brand-neutral-dark/20 overflow-hidden border border-brand-depth/50">
      <AnimatePresence mode="wait">
        {!selectedSet ? (
          <motion.div
            key="search"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col h-full"
          >
            <div className="p-3 border-b border-brand-depth bg-brand-neutral-dark relative flex gap-2">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-neutral-light/50" />
                <input
                  type="text"
                  placeholder="Szukaj zestawu..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-brand-depth/30 border border-brand-depth/50 text-brand-neutral-light 
                            placeholder-brand-neutral-light/30 focus:outline-none focus:ring-1 focus:ring-brand-accent-1 focus:border-brand-accent-1 
                            transition-all"
                />
              </div>
              <button
                onClick={onCreateSet}
                className="bg-brand-accent-1 hover:bg-brand-accent-2 text-white p-3 rounded-lg transition-colors shadow-lg"
                title="Stwórz nowy zestaw"
              >
                +
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
              {loading && (
                <p className="text-brand-neutral-light/50 text-center py-8 text-sm animate-pulse">
                  Ładowanie...
                </p>
              )}
              {error && (
                <p className="text-red-400 text-center py-4 text-sm">
                  Błąd: {error}
                </p>
              )}

              {sets.map((set) => (
                <motion.div
                  key={set.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelectedSet(set)}
                  className="p-4 rounded-lg bg-brand-neutral-dark border border-brand-depth/50 
                            cursor-pointer transition-colors group shadow-sm hover:shadow-md hover:border-brand-accent-3/30
                            hover:bg-brand-neutral-dark/90"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-brand-neutral-light group-hover:text-brand-accent-3 transition-colors">
                        {set.name}
                      </h4>
                      {set.description && (
                        <p className="text-xs text-brand-neutral-light/50 mt-1 line-clamp-1">
                          {set.description}
                        </p>
                      )}
                    </div>
                    <span className="text-xs font-bold text-brand-neutral-dark/80 bg-brand-depth px-2 py-1 rounded-full uppercase tracking-wide whitespace-nowrap">
                      {set.items?.length || 0} ćw.
                    </span>
                  </div>
                </motion.div>
              ))}

              {!loading && query && sets.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-brand-neutral-light/40">
                  <SearchIcon className="text-4xl mb-2 opacity-20" />
                  <p className="text-sm">Brak wyników</p>
                </div>
              )}

              {!loading && !query && sets.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-brand-neutral-light/30">
                  <p className="text-sm">Brak zestawów</p>
                  <button
                    onClick={onCreateSet}
                    className="mt-2 text-brand-accent-1 hover:underline cursor-pointer text-sm"
                  >
                    Stwórz swój pierwszy zestaw
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col h-full p-4"
          >
            <div className="flex items-start justify-between border-b border-brand-depth pb-4 mb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-brand-neutral-light">
                  {selectedSet.name}
                </h3>
                <p className="text-xs text-brand-neutral-light/60 uppercase tracking-wider mt-1">
                  Liczba ćwiczeń: {selectedSet.items?.length || 0}
                </p>
                <p className="text-xs text-brand-neutral-light/60 uppercase tracking-wider mt-1">
                  {selectedSet.description}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => setSelectedSet(null)}
                  className="text-sm text-brand-neutral-light/60 hover:text-brand-neutral-light hover:underline transition-all 
                            cursor-pointer p-1"
                >
                  Wróć
                </button>
                <div className="ml-4 flex sm:flex-row flex-col gap-2">
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="flex items-center justify-center p-1.5 rounded-lg bg-brand-depth/40 text-brand-neutral-light/70 
                    hover:text-brand-accent-3 hover:bg-brand-accent-3/10 transition-colors cursor-pointer"
                    title="Edytuj zestaw"
                  >
                    <EditIcon className="scale-75" />
                  </button>
                  <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="flex items-center justify-center p-1.5 rounded-lg bg-brand-depth/40 text-brand-neutral-light/70 
                    hover:text-red-400 hover:bg-red-400/10 transition-colors cursor-pointer"
                    title="Usuń zestaw"
                  >
                    <DeleteIcon className="scale-75" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto mb-4 custom-scrollbar">
              <div className="space-y-2">
                {selectedSet.items?.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-3 rounded bg-brand-depth/20 border border-brand-depth/40 flex justify-between items-center"
                  >
                    <div className="flex gap-3 items-center">
                      <span className="text-brand-neutral-light/30 font-bold text-xs w-4">
                        {index + 1}.
                      </span>
                      <div>
                        <p className="text-brand-neutral-light font-medium text-sm">
                          {item.exercise?.name}
                        </p>
                        <p className="text-brand-neutral-light/60 text-xs">
                          {item.exercise?.type === "strength"
                            ? `${item.sets} x ${item.reps} • ${
                                item.weight_kg || 0
                              }kg`
                            : `${item.sets} serii • ${
                                item.duration_min || item.reps
                              } min/powt`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <motion.button
              onClick={handleAdd}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-auto w-full py-3.5 bg-brand-accent-1 hover:bg-brand-accent-2 cursor-pointer text-white font-bold rounded-xl 
                         shadow-lg hover:shadow-brand-accent-1/20 transition-all flex items-center justify-center gap-2"
            >
              Dodaj zestaw treningowy
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {isEditModalOpen && selectedSet && (
        <SetModal
          initialData={selectedSet}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={() => {
            refreshSets();
            setSelectedSet(null);
            setIsEditModalOpen(false);
          }}
        />
      )}

      <ConfirmDeleteDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Usuń zestaw"
        description={
          <p>
            Czy na pewno chcesz usunąć zestaw{" "}
            <strong className="text-brand-neutral-light">
              {selectedSet?.name}
            </strong>
            ?
          </p>
        }
      />
    </div>
  );
}
