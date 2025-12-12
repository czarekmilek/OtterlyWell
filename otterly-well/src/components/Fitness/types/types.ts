export interface Exercise {
  id: string;
  name: string;
  muscle_group: string;
  type: "strength" | "cardio";
  created_by?: string;
}

export interface WorkoutEntry {
  id: string;
  user_id: string;
  exercise_id: string;
  sets?: number;
  reps?: number;
  weight_kg?: number;
  duration_min?: number;
  created_at: string;
  exercise?: Exercise;
}
