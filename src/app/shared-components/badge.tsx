"use client";

interface BadgeProps {
  pill?: boolean;
  caption: string;
  textColor: string;
  bgColor: string;
}

export default function BadgeComponent({
  pill = false,
  caption,
  textColor,
  bgColor,
}: BadgeProps) {
  return (
    <div
      className={[
        pill ? "rounded-full" : "rounded-sm",
        textColor,
        bgColor,
        "inline-flex items-center font-semibold text-xs py-1 px-3",
      ].join(" ")}
    >
      {caption}
    </div>
  );
}
