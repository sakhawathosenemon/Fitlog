import Image from "next/image";

// Static content → Server Component.
export default function Footer() {
  return (
    <footer className="border-t border-[#1a1d24] bg-[#090a0d]">
      <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-3 px-6 py-8 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="" width={20} height={20} />
          <span className="font-display text-sm font-bold tracking-[0.05em]">
            FITLOG
          </span>
        </div>
        <p className="text-xs text-muted">
          © 2026 FitLog — Workout Library. Train hard, log honest.
        </p>
      </div>
    </footer>
  );
}
