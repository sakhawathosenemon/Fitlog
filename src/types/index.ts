/** One workout exactly as returned by the FitLog API. */
export interface Workout {
  id: number;
  name: string;
  image: string;
  muscleGroups: string[];
  equipment: string;
  difficulty: string;
  duration: number; // minutes
  caloriesBurned: number; // kcal
  sets: number;
  reps: string; // e.g. "6-8", "30-45s"
  rating: number;
  description: string;
  instructions: string[];
}

/** A workout inside "Today's Plan" — also tracks whether it's been completed. */
export interface PlanWorkout extends Workout {
  isDone: boolean;
}
