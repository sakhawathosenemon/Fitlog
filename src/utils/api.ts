import { Workout } from "@/types";

/**
 * Primary API first, alternative API second (both are listed in the README).
 * If the first one is down, the app quietly falls back to the second.
 */
const API_BASES = [
  "https://api.abcz.workers.dev/api/fitlog",
  "https://api.api-store.workers.dev/api/fitlog",
];

/** Thrown when the API says "this workout doesn't exist". */
export class WorkoutNotFoundError extends Error {
  constructor(id: string | number) {
    super(`Workout ${id} not found`);
    this.name = "WorkoutNotFoundError";
  }
}

/** Does this value look like a Workout? (guards against odd API responses) */
function isWorkout(value: unknown): value is Workout {
  if (typeof value !== "object" || value === null) return false;
  const w = value as Record<string, unknown>;
  return (
    typeof w.id === "number" &&
    typeof w.name === "string" &&
    Array.isArray(w.muscleGroups) &&
    Array.isArray(w.instructions)
  );
}

/** Fetch `path` from each API base in turn and return the first good JSON. */
async function fetchFromApi(path = ""): Promise<unknown> {
  let lastError: unknown = new Error("Failed to fetch workouts");

  for (const base of API_BASES) {
    try {
      const res = await fetch(`${base}${path}`);
      if (res.status === 404) throw new WorkoutNotFoundError(path.slice(1));
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      return await res.json();
    } catch (error) {
      // A real "404 not found" is final — no point asking the backup API.
      if (error instanceof WorkoutNotFoundError) throw error;
      lastError = error;
    }
  }

  throw lastError;
}

/** All workouts (12 items). */
export async function getAllWorkouts(): Promise<Workout[]> {
  const data = await fetchFromApi();
  // Accept either a bare array or { data: [...] }
  const list = Array.isArray(data)
    ? data
    : (data as { data?: unknown } | null)?.data;

  if (!Array.isArray(list)) throw new Error("Unexpected API response");
  return list.filter(isWorkout);
}

/** A single workout by id. Throws WorkoutNotFoundError for unknown ids. */
export async function getWorkoutById(id: string): Promise<Workout> {
  // Ids in the URL must be plain numbers — anything else is an invalid route.
  if (!/^\d+$/.test(id)) throw new WorkoutNotFoundError(id);

  try {
    const data = await fetchFromApi(`/${id}`);
    // Accept either the object itself or { data: {...} }
    const item = (data as { data?: unknown } | null)?.data ?? data;
    if (isWorkout(item)) return item;
  } catch (error) {
    if (error instanceof WorkoutNotFoundError) throw error;
    // otherwise fall through and try the full list below
  }

  // Fallback: find it inside the full list.
  const all = await getAllWorkouts();
  const found = all.find((w) => w.id === Number(id));
  if (!found) throw new WorkoutNotFoundError(id);
  return found;
}
