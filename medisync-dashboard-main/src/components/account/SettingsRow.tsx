import { motion } from "framer-motion";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SettingsRowProps {
  Icon: LucideIcon;
  label: string;
  tintClass: string;
  iconClass: string;
  isLast?: boolean;
  value?: string;
  onClick?: () => void;
}

export function SettingsRow({
  Icon,
  label,
  tintClass,
  iconClass,
  isLast,
  value,
  onClick,
}: SettingsRowProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ backgroundColor: "var(--muted)" }}
      transition={{ duration: 0.1 }}
      className={cn(
        "flex min-h-[56px] w-full items-center gap-4 px-4 py-3 text-left",
        !isLast && "border-b border-border/60",
      )}
    >
      <div
        className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", tintClass)}
      >
        <Icon className={cn("h-5 w-5", iconClass)} strokeWidth={2.25} />
      </div>
      <span className="flex-1 text-base font-medium text-foreground">{label}</span>
      {value ? (
        <span className="mr-1 text-sm font-medium text-muted-foreground">{value}</span>
      ) : null}
      <ChevronRight className="h-5 w-5 text-muted-foreground" strokeWidth={2.25} />
    </motion.button>
  );
}
