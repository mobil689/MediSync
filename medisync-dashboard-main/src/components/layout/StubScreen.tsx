import type { LucideIcon } from "lucide-react";

interface StubScreenProps {
  Icon: LucideIcon;
  title: string;
  description: string;
}

export function StubScreen({ Icon, title, description }: StubScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-[oklch(0.97_0.03_265)] pb-24">
      <div className="mx-auto flex min-h-[80vh] max-w-md flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 shadow-float">
          <Icon className="h-10 w-10 text-primary" strokeWidth={2} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
        <span className="mt-5 rounded-full bg-warning-tint px-3 py-1 text-xs font-semibold uppercase tracking-wider text-warning-foreground">
          Coming next
        </span>
      </div>
    </div>
  );
}
