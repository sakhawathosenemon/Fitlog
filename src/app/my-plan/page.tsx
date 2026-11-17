"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, ChevronDown, X } from "lucide-react";
import Spinner from "@/components/Spinner";
import WorkoutStats from "@/components/WorkoutStats";
import { usePlan } from "@/context/PlanContext";
import { PlanWorkout, Workout } from "@/types";

type Tab = "plan" | "saved";
type SortBy = "duration" | "calories" | "rating";

const TABS: { id: Tab; label: string }[] = [
  { id: "plan", label: "Today's Plan" },
  { id: "saved", label: "Saved" },
];

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: "duration", label: "Duration" },
  { value: "calories", label: "Calories" },
  { value: "rating", label: "Rating" },
];

export default function MyPlanPage() {
  const {
    plan,
    saved,
    isHydrated,
    metrics,
    removeFromPlan,
    removeFromSaved,
    markAsDone,
  } = usePlan();

  const [activeTab, setActiveTab] = useState<Tab>("plan");
  const [sortBy, setSortBy] = useState<SortBy>("duration");

  const currentList: Array<Workout | PlanWorkout> =
    activeTab === "plan" ? plan : saved;

  // Copy first — .sort() mutates, and we must never mutate React state.
  const sortedList = [...currentList].sort((a, b) => {
    if (sortBy === "duration") return a.duration - b.duration; // shortest first
    if (sortBy === "calories") return b.caloriesBurned - a.caloriesBurned; // highest first
    return b.rating - a.rating; // best first
  });

  const handleRemove = (id: number) =>
    activeTab === "plan" ? removeFromPlan(id) : removeFromSaved(id);

  return (
    <div className="mx-auto max-w-[1280px] px-6 pb-20 pt-10">
      {/* Title */}
      <h1 className="font-display text-3xl font-bold uppercase tracking-[-0.025em]">
        MY PLAN
      </h1>
      <p className="mt-1 text-sm text-muted">
        Cap of five lifts for today. Finish them, then load more.
      </p>

      {/* Metrics — recalculated automatically from the plan */}
      <dl className="mt-7 grid grid-cols-3 divide-x divide-line rounded-2xl border border-line bg-surface-2 py-6">
        <Metric label="Exercises" value={metrics.exercises} />
        <Metric label="Minutes" value={metrics.minutes} />
        <Metric label="Calories" value={metrics.calories} />
      </dl>

      {/* Tabs + sort */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div
          role="tablist"
          aria-label="My plan lists"
          className="inline-flex gap-1 rounded-xl border border-line bg-[#151921] p-1"
        >
          {TABS.map(({ id, label }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                id={`tab-${id}`}
                aria-selected={active}
                aria-controls="plan-panel"
                onClick={() => setActiveTab(id)}
                className={`rounded-lg border px-4 py-1.5 text-xs transition-colors ${
                  active
                    ? "border-[#2b303d] bg-[#1f242d] font-bold text-white"
                    : "border-transparent font-normal text-muted hover:text-white"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 text-xs text-muted">
          <label htmlFor="sort-by">Sort By</label>
          <div className="relative">
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="h-[34px] cursor-pointer appearance-none rounded-[9px] border border-line bg-surface-2 pl-3 pr-8 text-xs text-white"
            >
              {SORT_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              aria-hidden="true"
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted"
            />
          </div>
        </div>
      </div>

      {/* List */}
      <div
        id="plan-panel"
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        className="mt-5"
      >
        {!isHydrated ? (
          <div
            role="status"
            aria-live="polite"
            className="flex items-center justify-center gap-3 py-16 text-sm text-muted"
          >
            <Spinner /> Loading workouts…
          </div>
        ) : sortedList.length === 0 ? (
          <div className="rounded-2xl border border-line bg-surface px-6 py-16 text-center">
            <h2 className="font-display text-2xl font-bold uppercase tracking-wide">
              NOTHING HERE YET
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
              Browse the library and add a lift to get today moving.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex h-10 items-center rounded-md bg-accent px-6 text-xs font-bold uppercase tracking-wide text-black transition hover:brightness-110"
            >
              Go to workouts
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {sortedList.map((item) => {
              const isDone =
                activeTab === "plan" && (item as PlanWorkout).isDone === true;

              return (
                <li
                  key={item.id}
                  className="flex flex-col gap-4 rounded-2xl border border-line bg-[#14171e] p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  {/* Thumbnail + info */}
                  <div className="flex items-center gap-4">
                    <div
                      className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-[#1f2937] sm:w-36 ${
                        isDone ? "opacity-60" : ""
                      }`}
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        unoptimized
                        sizes="144px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-display text-base font-bold uppercase tracking-[0.025em]">
                        {item.name}
                      </h2>
                      <p className="mt-0.5 text-xs font-semibold text-muted">
                        {item.equipment}
                      </p>
                      <WorkoutStats
                        duration={item.duration}
                        calories={item.caloriesBurned}
                        rating={item.rating}
                        className="mt-2 flex-wrap gap-x-3 gap-y-1"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Link
                      href={`/workout/${item.id}`}
                      className="inline-flex h-[34px] items-center rounded-full border border-line-strong px-4 text-xs text-[#e5e7eb] transition-colors hover:border-accent/60 hover:text-white"
                    >
                      View Details
                    </Link>

                    {activeTab === "plan" &&
                      (isDone ? (
                        <span className="inline-flex h-8 items-center gap-1.5 rounded-full border border-accent/40 px-4 text-xs font-semibold text-accent">
                          <Check size={14} aria-hidden="true" />
                          Done
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => markAsDone(item.id)}
                          className="inline-flex h-8 items-center gap-1.5 rounded-full bg-accent px-4 text-xs font-semibold text-black transition hover:brightness-110"
                        >
                          <Check size={14} aria-hidden="true" />
                          Mark as Done
                        </button>
                      ))}

                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      aria-label={`Remove ${item.name}`}
                      className="grid size-7 place-items-center rounded-full text-muted transition-colors hover:bg-line hover:text-white"
                    >
                      <X size={16} aria-hidden="true" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="px-4 sm:px-8">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-1 font-display text-3xl font-bold tabular-nums sm:text-4xl">
        {value}
      </dd>
    </div>
  );
}
