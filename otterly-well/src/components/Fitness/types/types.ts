export interface Exercise {
  id: string;
  name: string;
  muscle_group: string;
  type: "strength" | "cardio" | "stretching";
  created_by?: string;
}

export interface ExerciseSetItem {
  id: string;
  set_id: string;
  exercise_id: string;
  order_index: number;
  sets: number;
  reps: number;
  weight_kg?: number;
  duration_min?: number;
  created_at: string;
  exercise?: Exercise;
}

export interface ExerciseSet {
  id: string;
  name: string;
  description?: string;
  created_by: string;
  created_at: string;
  items?: ExerciseSetItem[];
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
