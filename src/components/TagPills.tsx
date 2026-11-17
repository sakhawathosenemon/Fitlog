/** Muscle-group pills (CHEST, ARMS …). `card` = small caps, `detail` = larger. */
export default function TagPills({
  tags,
  variant = "card",
}: {
  tags: string[];
  variant?: "card" | "detail";
}) {
  const style =
    variant === "card"
      ? "px-2.5 py-0.5 text-[11px] uppercase tracking-wide"
      : "px-3.5 py-1 text-xs";

  return (
    <ul className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li
          key={tag}
          className={`rounded-full bg-accent font-bold text-black ${style}`}
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}
