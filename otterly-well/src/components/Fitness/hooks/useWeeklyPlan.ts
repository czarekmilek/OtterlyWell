import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";
import type { ExerciseSet } from "../types/types";

export function useWeeklyPlan() {
  const [loading, setLoading] = useState(false);
  const [weeklyPlan, setWeeklyPlan] = useState<ExerciseSet[]>([]);

  const fetchWeeklyPlan = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("workout_sets")
      .select("*, items:workout_set_items(*)")
      .eq("created_by", user.id)
      .not("scheduled_day", "is", null);

    if (error) {
      console.error("Error fetching weekly plan:", error);
    } else {
      setWeeklyPlan(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWeeklyPlan();
  }, []);

  const updateScheduledDay = async (setId: string, dayIndex: number | null) => {
    if (!setId) return;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    if (dayIndex !== null) {
      await supabase
        .from("workout_sets")
        .update({ scheduled_day: null })
        .eq("created_by", user.id)
        .eq("scheduled_day", dayIndex);
    }

    const { error } = await supabase
      .from("workout_sets")
      .update({ scheduled_day: dayIndex })
      .eq("id", setId);

    if (error) {
      console.error("Error updating scheduled day:", error);
    } else {
      await fetchWeeklyPlan();
    }
  };

  const getDayPlan = (dayIndex: number) => {
    return weeklyPlan.find((set) => set.scheduled_day === dayIndex);
  };

  return {
    loading,
    weeklyPlan,
    updateScheduledDay,
    getDayPlan,
    refreshPlan: fetchWeeklyPlan,
  };
}
