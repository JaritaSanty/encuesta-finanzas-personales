import { cn } from "@/lib/utils";

type ProgressProps = {
  value: number;
  className?: string;
};

export function Progress({ value, className }: ProgressProps) {
  return (
    <div role="progressbar" aria-label="Preguntas respondidas" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value)} className={cn("h-2 w-full rounded-full bg-muted", className)}>
      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}
