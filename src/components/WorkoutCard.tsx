import Image from "next/image";
import Link from "next/link";
import { Workout } from "@/types";
import TagPills from "./TagPills";
import WorkoutStats from "./WorkoutStats";

// Only receives props → no hooks → stays a Server Component.
export default function WorkoutCard({ workout }: { workout: Workout }) {
  return (
    <Link
      href={`/workout/${workout.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition duration-300 hover:-translate-y-1 hover:border-accent/50 motion-reduce:transform-none"
    >
      {/* Illustration */}
      <div className="relative h-48 w-full shrink-0 overflow-hidden bg-thumb">
        <Image
          src={workout.image}
          alt={workout.name}
          fill
          unoptimized
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110 motion-reduce:transform-none"
        />
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col p-6">
        <TagPills tags={workout.muscleGroups} />

        <h3 className="mt-3 font-display text-lg font-bold uppercase tracking-[0.025em]">
          {workout.name}
        </h3>
        <p className="mt-1 text-xs text-muted">{workout.equipment}</p>

        <WorkoutStats
          duration={workout.duration}
          calories={workout.caloriesBurned}
          rating={workout.rating}
          className="mt-auto border-t border-line-soft pt-4"
        />
      </div>
    </Link>
  );
}
