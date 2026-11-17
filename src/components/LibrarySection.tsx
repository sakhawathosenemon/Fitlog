"use client";

import { useEffect, useState } from "react";
import { Workout } from "@/types";
import { getAllWorkouts } from "@/utils/api";
import Spinner from "./Spinner";
import WorkoutCard from "./WorkoutCard";

const GRID =
  "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"; // 3 × 4 on large screens

export default function LibrarySection() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0); // bump to retry

  useEffect(() => {
    let cancelled = false; // ignore the result if the component unmounted

    async function loadData() {
      try {
        const data = await getAllWorkouts();
        if (!cancelled) setWorkouts(data);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false); // success OR error → stop loading
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = () => {
    setError(false);
    setLoading(true);
    setAttempt((n) => n + 1);
  };

  return (
    // id="library" is the target of the hero's "BROWSE WORKOUTS" anchor.
    // scroll-mt keeps the heading clear of the sticky navbar.
    <section
      id="library"
      className="mx-auto max-w-[1280px] scroll-mt-28 px-6 pb-20 pt-16 sm:scroll-mt-20"
    >
      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold uppercase tracking-[-0.025em]">
          THE LIBRARY
        </h2>
        <p className="mt-1 text-sm text-muted">
          Twelve lifts covering every major muscle group.
        </p>
      </div>

      {loading ? (
        <div role="status" aria-live="polite">
          <div className="flex items-center justify-center gap-3 pb-8 text-sm text-muted">
            <Spinner /> Loading workouts…
          </div>
          <div className={GRID} aria-hidden="true">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[368px] animate-pulse overflow-hidden rounded-2xl border border-line bg-surface"
              >
                <div className="h-48 bg-thumb" />
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div
          role="alert"
          className="rounded-2xl border border-line bg-surface px-6 py-14 text-center"
        >
          <p className="font-display text-xl font-bold uppercase tracking-wide">
            Couldn&apos;t load workouts
          </p>
          <p className="mt-2 text-sm text-muted">
            Check your connection and try again.
          </p>
          <button
            type="button"
            onClick={retry}
            className="mt-6 inline-flex h-10 items-center rounded-md bg-accent px-6 text-sm font-semibold text-black transition hover:brightness-110"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className={GRID}>
          {workouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </div>
      )}
    </section>
  );
}
