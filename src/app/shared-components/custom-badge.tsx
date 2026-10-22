"use client";

interface CustomBadgeProps {
  text: string;
  baseColor?: "red" | "green" | "blue" | "yellow" | "orange" | "purple" | "pink" | "teal" | "cyan" | "amber" | "lime" | "indigo" | "brown" | "gray" | "slate" | "zinc" | "neutral" | "stone";
  className?: string;
}

// Mapping of base colors to Tailwind lighten-3 (300) for background and darken-3 (700) for text
const colorClasses: Record<string, { bg: string; text: string }> = {
  red: { bg: "bg-red-100", text: "text-red-700" },
  green: { bg: "bg-green-100", text: "text-green-700" },
  blue: { bg: "bg-blue-100", text: "text-blue-700" },
  yellow: { bg: "bg-yellow-100", text: "text-yellow-700" },
  orange: { bg: "bg-orange-100", text: "text-orange-700" },
  purple: { bg: "bg-purple-100", text: "text-purple-700" },
  pink: { bg: "bg-pink-100", text: "text-pink-700" },
  teal: { bg: "bg-teal-100", text: "text-teal-700" },
  cyan: { bg: "bg-cyan-100", text: "text-cyan-700" },
  amber: { bg: "bg-amber-100", text: "text-amber-700" },
  lime: { bg: "bg-lime-100", text: "text-lime-700" },
  indigo: { bg: "bg-indigo-100", text: "text-indigo-700" },
  brown: { bg: "bg-orange-100", text: "text-orange-800" }, // Tailwind doesn't have brown, using orange
  gray: { bg: "bg-gray-100", text: "text-gray-700" },
  slate: { bg: "bg-slate-100", text: "text-slate-700" },
  zinc: { bg: "bg-zinc-100", text: "text-zinc-700" },
  neutral: { bg: "bg-neutral-100", text: "text-neutral-700" },
  stone: { bg: "bg-stone-100", text: "text-stone-700" },
};

export default function CustomBadge({
  text,
  baseColor = "blue",
  className = "",
}: CustomBadgeProps) {
  const colors = colorClasses[baseColor] || colorClasses.blue;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text} ${className}`}
    >
      {text}
    </span>
  );
}
