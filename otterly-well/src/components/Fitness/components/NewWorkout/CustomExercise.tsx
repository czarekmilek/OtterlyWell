import { useState } from "react";
import { supabase } from "../../../../lib/supabaseClient";
import { useAuth } from "../../../../context/AuthContext";

interface CustomExerciseProps {
  onExerciseCreated: () => void;
}

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 h-full mt-2">
      <div className="flex flex-col gap-2">
        <label className="text-sm text-brand-neutral-light">
          Nazwa ćwiczenia
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="p-3 rounded-lg bg-brand-neutral-dark border border-brand-depth text-brand-neutral-light focus:outline-none focus:border-brand-accent-1"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-brand-neutral-light">
            Partia mięśniowa
          </label>
          <select
            value={muscleGroup}
            onChange={(e) => setMuscleGroup(e.target.value)}
            className="p-3 rounded-lg bg-brand-neutral-dark border border-brand-depth text-brand-neutral-light focus:outline-none focus:border-brand-accent-1"
          >
            <option value="chest">Klatka</option>
            <option value="back">Plecy</option>
            <option value="legs">Nogi</option>
            <option value="shoulders">Barki</option>
            <option value="arms">Ramiona</option>
            <option value="core">Brzuch</option>
            <option value="cardio">Cardio</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-brand-neutral-light">Typ</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "strength" | "cardio")}
            className="p-3 rounded-lg bg-brand-neutral-dark border border-brand-depth text-brand-neutral-light focus:outline-none focus:border-brand-accent-1"
          >
            <option value="strength">Siłowe</option>
            <option value="cardio">Cardio</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-auto w-full py-3 bg-brand-accent-1 hover:bg-brand-accent-2 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
      >
        {loading ? "Zapisywanie..." : "Stwórz ćwiczenie"}
      </button>
    </form>
  );
}
