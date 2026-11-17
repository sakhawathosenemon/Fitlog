import Link from "next/link";

// Next.js shows this automatically for any URL that doesn't match a route
// (and when we call notFound(), e.g. /workout/999).
export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[1280px] flex-col items-center justify-center px-6 py-20 text-center">
      <p className="font-display text-8xl font-bold leading-none tracking-[-0.025em] text-accent sm:text-9xl">
        404
      </p>
      <h1 className="mt-4 font-display text-3xl font-bold uppercase tracking-[-0.025em]">
        Page Not Found
      </h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        That page doesn&apos;t exist or has been moved. Head back to the
        library and pick a lift.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-10 items-center rounded-md bg-accent px-6 text-sm font-semibold text-black transition hover:brightness-110"
      >
        Back to Home
      </Link>
    </div>
  );
}
