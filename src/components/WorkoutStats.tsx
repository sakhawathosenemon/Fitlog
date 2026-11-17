import { Clock, Flame, Star } from "lucide-react";

/** The little "25 min · 180 kcal · 4.8" row with icons. */
export default function WorkoutStats({
  duration,
  calories,
  rating,
  className = "",
}: {
  duration: number;
  calories: number;
  rating: number;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-4 text-xs text-soft ${className}`}>
      <span className="flex items-center gap-1.5">
        <Clock size={14} className="text-accent" aria-hidden="true" />
        {duration} min
      </span>
      <span className="flex items-center gap-1.5">
        <Flame size={14} className="text-accent" aria-hidden="true" />
        {calories} kcal
      </span>
      <span className="flex items-center gap-1.5">
        <Star size={14} className="text-accent" aria-hidden="true" />
        {rating}
      </span>
    </div>
  );
}
