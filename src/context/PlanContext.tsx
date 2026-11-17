"use client";
// "use client" → we use useState / useEffect / useContext, which are client-side hooks.

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import toast from "react-hot-toast";
import { PlanWorkout, Workout } from "@/types";

/** Max number of lifts allowed in today's plan. */
export const PLAN_LIMIT = 5;

const PLAN_KEY = "fitlog-plan";
const SAVED_KEY = "fitlog-saved";

// ═══════════════════════════════════════════════════
// STEP 1 — Describe what the Context will provide
// ═══════════════════════════════════════════════════
interface PlanContextType {
  plan: PlanWorkout[]; // Today's Plan
  saved: Workout[]; // Saved for later
  isHydrated: boolean; // true once localStorage has been read (client only)
  addToPlan: (workout: Workout) => void;
  addToSaved: (workout: Workout) => void;
  removeFromPlan: (id: number) => void;
  removeFromSaved: (id: number) => void;
  markAsDone: (id: number) => void;
  metrics: {
    exercises: number;
    minutes: number;
    calories: number;
  };
}

// ═══════════════════════════════════════════════════
// STEP 2 — Create the Context (null until a Provider exists)
// ═══════════════════════════════════════════════════
const PlanContext = createContext<PlanContextType | null>(null);

/** Safely read a JSON array from localStorage (never throws). */
function readList<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

/** Safely write to localStorage (private mode / quota errors are ignored). */
function writeList(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — the app still works, it just won't persist */
  }
}

// ═══════════════════════════════════════════════════
// STEP 3 — The Provider: all shared state + logic lives here
// ═══════════════════════════════════════════════════
export function PlanProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<PlanWorkout[]>([]);
  const [saved, setSaved] = useState<Workout[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // ─── Load from localStorage once, after the first client render ───
  // (Doing this in an effect — not in useState's initial value — avoids a
  //  server/client hydration mismatch, because the server has no localStorage.)
  useEffect(() => {
    setPlan(readList<PlanWorkout>(PLAN_KEY));
    setSaved(readList<Workout>(SAVED_KEY));
    setIsHydrated(true);
  }, []);

  // ─── Save whenever plan / saved change — but only AFTER hydration ───
  // Without the isHydrated check, the first render (plan = []) would
  // overwrite the stored data with an empty list.
  useEffect(() => {
    if (isHydrated) writeList(PLAN_KEY, plan);
  }, [plan, isHydrated]);

  useEffect(() => {
    if (isHydrated) writeList(SAVED_KEY, saved);
  }, [saved, isHydrated]);

  // ─── Actions ───
  const addToPlan = (workout: Workout) => {
    if (plan.some((item) => item.id === workout.id)) {
      toast.error("Already in today's plan");
      return;
    }
    if (plan.length >= PLAN_LIMIT) {
      toast.error(`Today's plan is full (max ${PLAN_LIMIT} lifts)`);
      return;
    }
    setPlan((prev) => [...prev, { ...workout, isDone: false }]);
    toast.success(`${workout.name} added to today's plan`);
  };

  const addToSaved = (workout: Workout) => {
    if (saved.some((item) => item.id === workout.id)) {
      toast.error("Already saved for later");
      return;
    }
    setSaved((prev) => [...prev, workout]);
    toast.success(`${workout.name} saved for later`);
  };

  const removeFromPlan = (id: number) => {
    setPlan((prev) => prev.filter((item) => item.id !== id));
    toast.success("Removed from today's plan");
  };

  const removeFromSaved = (id: number) => {
    setSaved((prev) => prev.filter((item) => item.id !== id));
    toast.success("Removed from saved");
  };

  const markAsDone = (id: number) => {
    setPlan((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isDone: true } : item)),
    );
    toast.success("Workout done — great job!");
  };

  // ─── Derived values: NOT extra state — recalculated on every render ───
  const metrics = {
    exercises: plan.length,
    minutes: plan.reduce((total, item) => total + item.duration, 0),
    calories: plan.reduce((total, item) => total + item.caloriesBurned, 0),
  };

  const value: PlanContextType = {
    plan,
    saved,
    isHydrated,
    addToPlan,
    addToSaved,
    removeFromPlan,
    removeFromSaved,
    markAsDone,
    metrics,
  };

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

// ═══════════════════════════════════════════════════
// STEP 4 — Custom hook: `const { plan, addToPlan } = usePlan()`
// ═══════════════════════════════════════════════════
export function usePlan() {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error("usePlan must be used within a PlanProvider");
  }
  return context;
}
