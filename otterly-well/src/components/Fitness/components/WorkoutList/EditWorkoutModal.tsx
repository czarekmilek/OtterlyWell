import { useState, useEffect } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import type { WorkoutEntry } from "../../types/types";
import { CloseIcon } from "../../../icons";

interface EditWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: WorkoutEntry;
  onSave: (id: string, updates: Partial<WorkoutEntry>) => Promise<void>;
}

export const EditWorkoutModal = ({
  isOpen,
  onClose,
  entry,
  onSave,
}: EditWorkoutModalProps) => {
  const [sets, setSets] = useState(entry.sets || 0);
  const [reps, setReps] = useState(entry.reps || 0);
  const [weight, setWeight] = useState(entry.weight_kg || 0);
  const [duration, setDuration] = useState(entry.duration_min || 0);
  const [distance, setDistance] = useState(entry.distance_km || 0);

  useEffect(() => {
    if (isOpen) {
      setSets(entry.sets || 0);
      setReps(entry.reps || 0);
      setWeight(entry.weight_kg || 0);
      setDuration(entry.duration_min || 0);
      setDistance(entry.distance_km || 0);
    }
  }, [entry, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const type = entry.exercise?.type || "strength";

    let updates: Partial<WorkoutEntry> = {};
    if (type === "strength") {
      updates = { sets, reps, weight_kg: weight };
    } else if (type === "cardio") {
      updates = { duration_min: duration, distance_km: distance };
    } else if (type === "stretching") {
      updates = { duration_min: duration };
    }

    await onSave(entry.id, updates);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-brand-neutral-darker/70 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-sm rounded-2xl bg-brand-neutral-dark border border-brand-depth p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-brand-neutral-light">
              Edytuj trening
            </h3>
            <button
              onClick={onClose}
              className="flex items-center justify-center text-brand-neutral-light/60 hover:text-brand-neutral-light transition-colors cursor-pointer 
                        hover:bg-brand-neutral-light/10 rounded-full p-1"
            >
              <CloseIcon />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {entry.exercise?.type === "strength" && (
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-brand-neutral-light/80 mb-1">
                    Serie
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={sets}
                    onChange={(e) => setSets(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-brand-neutral-dark/40 border border-brand-depth rounded-xl text-brand-neutral-light focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-neutral-light/80 mb-1">
                    Powt.
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={reps}
                    onChange={(e) => setReps(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-brand-neutral-dark/40 border border-brand-depth rounded-xl text-brand-neutral-light focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-neutral-light/80 mb-1">
                    Waga (kg)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-brand-neutral-dark/40 border border-brand-depth rounded-xl text-brand-neutral-light focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>
            )}

            {entry.exercise?.type === "cardio" && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-brand-neutral-light/80 mb-1">
                    Czas (min)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-brand-neutral-dark/40 border border-brand-depth rounded-xl text-brand-neutral-light focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-neutral-light/80 mb-1">
                    Dystans (km)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={distance}
                    onChange={(e) => setDistance(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-brand-neutral-dark/40 border border-brand-depth rounded-xl text-brand-neutral-light focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>
            )}

            {entry.exercise?.type === "stretching" && (
              <div>
                <label className="block text-sm font-medium text-brand-neutral-light/80 mb-1">
                  Czas (min)
                </label>
                <input
                  type="number"
                  min={0}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-brand-neutral-dark/40 border border-brand-depth rounded-xl text-brand-neutral-light focus:outline-none focus:border-brand-primary"
                />
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2 bg-brand-accent-2 rounded-xl text-brand-neutral-light font-bold hover:bg-brand-accent-2/60 transition-all cursor-pointer"
              >
                Zapisz
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
