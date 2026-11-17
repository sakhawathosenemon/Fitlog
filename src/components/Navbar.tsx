"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePlan } from "@/context/PlanContext";

const NAV_LINKS = [
  { href: "/", label: "Workouts" },
  { href: "/my-plan", label: "My Plan" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { plan, saved } = usePlan();

  // "Workouts" stays highlighted on the home page AND on a workout's detail page.
  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/" || pathname.startsWith("/workout")
      : pathname.startsWith(href);

  const linkClass = (href: string) =>
    `rounded-full px-4 py-1.5 text-xs transition-colors ${
      isActive(href)
        ? "bg-accent-tint font-semibold text-accent"
        : "font-medium text-muted hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-[#1b1f28] bg-base/90 backdrop-blur">
      <div className="mx-auto grid max-w-[1280px] grid-cols-[1fr_auto] items-center gap-4 px-6 py-3 sm:h-20 sm:grid-cols-[1fr_auto_1fr] sm:py-0">
        {/* Left — logo */}
        <Link
          href="/"
          className="flex w-fit items-center gap-2"
          aria-label="FitLog home"
        >
          <Image src="/logo.png" alt="" width={28} height={28} priority />
          <span className="font-display text-xl font-bold tracking-wider">
            FITLOG
          </span>
        </Link>

        {/* Middle — nav links (tablet / desktop) */}
        <nav aria-label="Main" className="hidden items-center gap-1 sm:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={linkClass(href)}
              aria-current={isActive(href) ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right — counters (both go to /my-plan) */}
        <div className="flex items-center justify-self-end gap-4">
          <CountBadge label="Plan" count={plan.length} filled />
          <CountBadge label="Saved" count={saved.length} />
        </div>
      </div>

      {/* Mobile — nav links drop to their own row */}
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-[1280px] items-center gap-1 px-6 pb-3 sm:hidden"
      >
        {NAV_LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={linkClass(href)}
            aria-current={isActive(href) ? "page" : undefined}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

function CountBadge({
  label,
  count,
  filled = false,
}: {
  label: string;
  count: number;
  filled?: boolean;
}) {
  return (
    <Link
      href="/my-plan"
      aria-label={`${label}: ${count}`}
      className="flex items-center gap-2 rounded-full text-xs font-medium text-soft transition-colors hover:text-white"
    >
      {label}
      {/* key={count} re-mounts the chip so it "pops" whenever the number changes */}
      <span
        key={count}
        className={`grid h-5 min-w-5 animate-pop place-items-center rounded-full px-1.5 text-[11px] tabular-nums ${
          filled
            ? "bg-accent font-bold text-black"
            : "border border-[#2d313b] font-medium text-white"
        }`}
      >
        {count}
      </span>
    </Link>
  );
}
