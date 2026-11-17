import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/oswald";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "FitLog — Workout Library",
    template: "%s | FitLog",
  },
  description:
    "FitLog is a dark, no-nonsense gym companion: pick a lift, lock it into today's plan, and watch the week's work add up.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-base font-sans text-white antialiased">
        {children}
      </body>
    </html>
  );
}
