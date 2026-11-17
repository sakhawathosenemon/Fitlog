"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Bookmark, BookmarkCheck, Plus } from "lucide-react";
import Spinner from "@/components/Spinner";
import TagPills from "@/components/TagPills";
import { PLAN_LIMIT, usePlan } from "@/context/PlanContext";
import { Workout } from "@/types";
import { getWorkoutById, WorkoutNotFoundError } from "@/utils/api";

// ⚠️ Next.js 15: `params` is a Promise. In a client component we unwrap it with React's `use()`.
type Params = Promise<{ id: string }>;
type Status = "loading" | "ready" | "not-found" | "error";

export default function WorkoutDetails({ params }: { params: Params }) {
  const { id } = use(params);

  const { plan, saved, addToPlan, addToSaved } = usePlan();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [attempt, setAttempt] = useState(0); // bump to retry

  useEffect(() => {
    let cancelled = false;

    async function loadWorkout() {
      try {
        const data = await getWorkoutById(id);
        if (cancelled) return;
        setWorkout(data);
        setStatus("ready");
      } catch (err) {
        if (cancelled) return;
        if (err instanceof WorkoutNotFoundError) {
          setStatus("not-found");
        } else {
          console.error(err);
          setStatus("error");
        }
      }
    }

    loadWorkout();
    return () => {
      cancelled = true;
    };
  }, [id, attempt]);

  const retry = () => {
    setStatus("loading");
    setAttempt((n) => n + 1);
  };

  // Unknown id (e.g. /workout/999) → show the app's 404 page.
  if (status === "not-found") notFound();

  if (status === "loading") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex min-h-[60vh] items-center justify-center gap-3 text-sm text-muted"
      >
        <Spinner /> Loading workout…
      </div>
    );
  }

  if (status === "error" || !workout) {
    return (
      <div
        role="alert"
        className="mx-auto flex min-h-[60vh] max-w-[1280px] flex-col items-center justify-center px-6 text-center"
      >
        <p className="font-display text-2xl font-bold uppercase tracking-wide">
          Couldn&apos;t load this workout
        </p>
        <p className="mt-2 text-sm text-muted">
          Check your connection and try again.
        </p>
        <button
          type="button"
          onClick={retry}
          className="mt-6 inline-flex h-10 items-center rounded-md bg-accent px-6 text-xs font-bold uppercase tracking-wide text-black transition hover:brightness-110"
        >
          Try again
        </button>
      </div>
    );
  }

  // Button state
  const isAlreadyInPlan = plan.some((item) => item.id === workout.id);
  const isPlanFull = plan.length >= PLAN_LIMIT;
  const isSaved = saved.some((item) => item.id === workout.id);

  const specs: { label: string; value: string }[] = [
    { label: "Equipment", value: workout.equipment },
    { label: "Difficulty", value: workout.difficulty },
    { label: "Sets", value: String(workout.sets) },
    { label: "Reps", value: workout.reps },
    { label: "Duration", value: `${workout.duration} min` },
    { label: "Calories", value: `${workout.caloriesBurned} kcal` },
    { label: "Rating", value: String(workout.rating) },
  ];

  return (
    <div className="mx-auto max-w-[1280px] px-6 pb-20 pt-8">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        {/* ── Left: big illustration ── */}
        <div className="relative min-h-[320px] overflow-hidden rounded-2xl border border-[#232834] bg-[#171a21] sm:min-h-[460px] lg:min-h-[735px]">
          <Image
            src={workout.image}
            alt={workout.name}
            fill
            priority
            unoptimized
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        {/* ── Right: info + actions ── */}
        <div>
          <h1 className="font-display text-3xl font-bold uppercase leading-tight tracking-[-0.025em] sm:text-4xl">
            {workout.name}
          </h1>
          <p className="mt-3 max-w-xl text-base leading-6 text-muted">
            {workout.description}
          </p>

          <div className="mt-5">
            <TagPills tags={workout.muscleGroups} variant="detail" />
          </div>

          {/* Key specs */}
          <dl className="mt-7 overflow-hidden rounded-2xl border border-[#232834] bg-[#151922]">
            {specs.map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4 border-b border-line-soft px-6 py-3.5 last:border-b-0"
              >
                <dt className="text-xs font-bold uppercase tracking-[0.05em] text-muted">
                  {label}
                </dt>
                <dd className="text-right text-sm font-medium">{value}</dd>
              </div>
            ))}
          </dl>

          {/* Instructions */}
          <section className="mt-8">
            <h2 className="font-display text-xl font-bold uppercase tracking-wide">
              Instructions
            </h2>
            <ol className="mt-4 space-y-3">
              {workout.instructions.map((step, index) => (
                <li key={index} className="flex gap-3 text-sm leading-6 text-soft">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-accent text-xs font-bold text-black"
                  >
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* Actions — the toasts come from the Context functions */}
          <div className="mt-9 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => addToPlan(workout)}
              disabled={isAlreadyInPlan || isPlanFull}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-accent px-6 text-sm font-semibold text-canvas transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:brightness-100"
            >
              <Plus size={16} aria-hidden="true" />
              {isAlreadyInPlan
                ? "Already in today's plan"
                : isPlanFull
                  ? "Today's plan is full"
                  : "Add to today's plan"}
            </button>

            <button
              type="button"
              onClick={() => addToSaved(workout)}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-line-strong px-6 text-sm font-semibold text-[#e5e7eb] transition hover:border-accent/60 hover:text-white"
            >
              {isSaved ? (
                <BookmarkCheck size={16} className="text-accent" aria-hidden="true" />
              ) : (
                <Bookmark size={16} aria-hidden="true" />
              )}
              {isSaved ? "Saved" : "Save for later"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
