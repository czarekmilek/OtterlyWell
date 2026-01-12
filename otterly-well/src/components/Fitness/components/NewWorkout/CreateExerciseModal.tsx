import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../../../lib/supabaseClient";
import { useAuth } from "../../../../context/AuthContext";
import CustomSelect from "../../../UI/CustomSelect";
import { CloseIcon, LoadingIcon } from "../../../icons";

interface CreateExerciseModalProps {
  onClose: () => void;
  onCreated: () => void;
}

const MUSCLE_GROUPS = [
  { label: "Klatka", value: "chest" },
  { label: "Plecy", value: "back" },
  { label: "Nogi", value: "legs" },
  { label: "Barki", value: "shoulders" },
  { label: "Ramiona", value: "arms" },
  { label: "Brzuch", value: "core" },
  { label: "Cardio", value: "cardio" },
];

const TYPES = [
  { label: "Siłowe", value: "strength" },
  { label: "Cardio", value: "cardio" },
  { label: "Rozciąganie", value: "stretching" },
];

export default function CreateExerciseModal({
  onClose,
  onCreated,
}: CreateExerciseModalProps) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("chest");
  const [type, setType] = useState<"strength" | "cardio" | "stretching">(
    "strength"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name) return;

    setLoading(true);
    setError(null);

    const { error: insertError } = await supabase.from("exercises").insert({
      name,
      muscle_group: type === "strength" ? muscleGroup : type,
      type,
      created_by: user.id,
    });

    setLoading(false);

    if (insertError) {
      console.error("Error creating custom exercise", insertError);
      setError("Nie udało się utworzyć ćwiczenia: " + insertError.message);
    } else {
      setName("");
      onCreated();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-neutral-dark/60">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-brand-neutral-dark border border-brand-depth w-full max-w-lg rounded-2xl 
                  shadow-2xl flex flex-col"
      >
        <div className="flex justify-between items-center p-4 border-b border-brand-depth bg-brand-neutral-dark/50 rounded-t-2xl">
          <h2 className="text-xl font-bold text-brand-neutral-light">
            Stwórz własne ćwiczenie
          </h2>
          <button
            onClick={onClose}
            className="p-1 cursor-pointer hover:bg-brand-depth rounded-full transition-colors hover:text-brand-neutral-dark 
                    text-brand-neutral-light flex items-center justify-center"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-brand-neutral-light font-medium">
              Nazwa ćwiczenia
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="np. Wyciskanie hantli"
              className="p-3 rounded-lg bg-brand-neutral-dark border border-brand-depth text-brand-neutral-light 
                         placeholder-brand-neutral-light/30 focus:outline-none focus:ring-1 focus:ring-brand-accent-1 
                         focus:border-brand-accent-1 transition-all"
            />
          </div>

          <div
            className={`grid grid-cols-1 ${
              type === "strength" ? "sm:grid-cols-2" : ""
            } gap-4`}
          >
            {type === "strength" && (
              <CustomSelect
                label="Partia mięśniowa"
                value={muscleGroup}
                onChange={setMuscleGroup}
                options={MUSCLE_GROUPS}
              />
            )}

            <CustomSelect
              label="Typ"
              value={type}
              onChange={(val) =>
                setType(val as "strength" | "cardio" | "stretching")
              }
              options={TYPES}
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center bg-red-400/10 p-2 rounded">
              {error}
            </p>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-4 w-full py-3 bg-brand-accent-1 hover:bg-brand-accent-2 text-white font-bold rounded-lg 
                       transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg 
                       cursor-pointer hover:shadow-brand-accent-1/20"
          >
            {loading ? (
              <>
                <LoadingIcon className="animate-spin" /> Zapisywanie...
              </>
            ) : (
              "Stwórz ćwiczenie"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
