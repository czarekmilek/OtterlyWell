import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { supabase } from "../../../lib/supabaseClient";

export function useExerciseMutations() {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteExercise = async (exerciseId: string) => {
    if (!user) {
      throw new Error("Musisz być zalogowany, aby usuwać ćwiczenia.");
    }

    setIsDeleting(true);
    setError(null);

    try {
      const { error: logsError } = await supabase
        .from("workout_logs")
        .delete()
        .eq("exercise_id", exerciseId);

      if (logsError) throw logsError;

      const { error: setsError } = await supabase
        .from("workout_set_items")
        .delete()
        .eq("exercise_id", exerciseId);

      if (setsError) throw setsError;

      const { error: deleteError, data } = await supabase
        .from("exercises")
        .delete()
        .eq("id", exerciseId)
        .select();

      if (deleteError) throw deleteError;

      if (!data || data.length === 0) {
        throw new Error(
          "Nie udało się usunąć ćwiczenia. Możesz usuwać tylko ćwiczenia stworzone przez siebie.",
        );
      }

      return true;
    } catch (err: any) {
      console.error("Error deleting exercise:", err);
      const message = err.message || "Wystąpił nieznany błąd podczas usuwania.";
      setError(message);
      throw new Error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteExercise,
    isDeleting,
    error,
  };
}
