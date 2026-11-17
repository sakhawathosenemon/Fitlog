import Image from "next/image";
import { ArrowDown } from "lucide-react";

// Static content → a Server Component (no "use client" needed).
export default function Hero() {
  return (
    <section className="mx-auto max-w-[1280px] px-6 pt-8">
      <div className="grid items-center gap-8 overflow-hidden rounded-2xl border border-line bg-surface p-8 sm:p-12 lg:min-h-[448px] lg:grid-cols-2 lg:px-14">
        {/* Left — copy */}
        <div className="max-w-[558px]">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-accent">
            WORKOUT LIBRARY
          </p>

          <h1 className="mt-5 font-display text-4xl font-bold uppercase leading-[1.02] tracking-[-0.025em] sm:text-5xl lg:text-6xl">
            TRAIN WITH INTENT. LOG EVERY SET.
          </h1>

          <p className="mt-5 max-w-[482px] text-base leading-6 text-muted">
            FitLog is a dark, no-nonsense gym companion: pick a lift, lock it
            into today&apos;s plan, and watch the week&apos;s work add up.
          </p>

          {/* Plain anchor → scrolls to #library on the same page (no route change) */}
          <a
            href="#library"
            className="mt-8 inline-flex h-10 items-center gap-2 rounded-md bg-accent px-6 text-xs font-bold uppercase tracking-wide text-black transition hover:brightness-110"
          >
            BROWSE WORKOUTS
            <ArrowDown size={16} aria-hidden="true" />
          </a>
        </div>

        {/* Right — banner image (stacks under the text on small screens) */}
        <div className="flex justify-center lg:justify-end lg:pr-8">
          <Image
            src="/banner.png"
            alt="Anatomical figure training biceps on a preacher curl machine"
            width={334}
            height={334}
            priority
            className="h-auto w-full max-w-[240px] sm:max-w-[334px]"
          />
        </div>
      </div>
    </section>
  );
}
