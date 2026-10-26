// app/shared-components/SectionTitle.tsx
type SectionTitleProps = {
  title: string;
  className?: string;
};

export default function SectionTitle({
  title,
  className = "",
}: SectionTitleProps) {
  return <span className={`step-title ${className}`}>{title}</span>;
}