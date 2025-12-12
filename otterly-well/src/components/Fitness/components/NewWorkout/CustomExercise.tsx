import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../../../lib/supabaseClient";
import { useAuth } from "../../../../context/AuthContext";
import CustomSelect from "../../../UI/CustomSelect";
import { LoadingIcon } from "../../../icons";

interface CustomExerciseProps {
  onExerciseCreated: () => void;
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
];

export default function CustomExercise({
  onExerciseCreated,
}: CustomExerciseProps) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("chest");
  const [type, setType] = useState<"strength" | "cardio">("strength");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name) return;

    setLoading(true);
    const { error } = await supabase.from("exercises").insert({
      name,
      muscle_group: muscleGroup,
      type,
      created_by: user.id,
    });

    setLoading(false);

    if (error) {
      console.error("Error creating custom exercise", error);
    } else {
      setName("");
      onExerciseCreated();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 h-full mt-2">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CustomSelect
          label="Partia mięśniowa"
          value={muscleGroup}
          onChange={setMuscleGroup}
          options={MUSCLE_GROUPS}
        />

        <CustomSelect
          label="Typ"
          value={type}
          onChange={(val) => setType(val as "strength" | "cardio")}
          options={TYPES}
        />
      </div>

      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-auto w-full py-3 bg-brand-accent-1 hover:bg-brand-accent-2 text-white font-bold rounded-lg 
                   transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-brand-accent-1/20"
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
  );
}
