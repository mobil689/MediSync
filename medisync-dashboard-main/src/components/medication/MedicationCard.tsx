import { motion } from "framer-motion";
import { Sun, Sunset, Moon, CloudSun, Check, AlertCircle, Clock } from "lucide-react";
import {
  getMedicationStatus,
  type Medication,
  type TimeOfDay,
} from "@/contexts/MedicationContext";
import { useLongPress } from "@/hooks/use-long-press";
import { cn } from "@/lib/utils";

interface MedicationCardProps {
  medication: Medication;
  onRequestLog: (med: Medication) => void;
  selectionMode?: boolean;
  selected?: boolean;
  onLongPress?: (med: Medication) => void;
  onToggleSelect?: (med: Medication) => void;
}

const timeIconMap: Record<TimeOfDay, { Icon: typeof Sun; tintClass: string; iconClass: string }> = {
  morning: { Icon: Sun, tintClass: "bg-warning-tint", iconClass: "text-warning-foreground" },
  afternoon: { Icon: CloudSun, tintClass: "bg-info-tint", iconClass: "text-primary" },
  evening: { Icon: Sunset, tintClass: "bg-danger-tint", iconClass: "text-danger" },
  night: { Icon: Moon, tintClass: "bg-violet-tint", iconClass: "text-[oklch(0.45_0.18_295)]" },
};

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function MedicationCard({
  medication,
  onRequestLog,
  selectionMode = false,
  selected = false,
  onLongPress,
  onToggleSelect,
}: MedicationCardProps) {
  const status = getMedicationStatus(medication);
  const { Icon, tintClass, iconClass } = timeIconMap[medication.timeOfDay];

  const longPress = useLongPress({
    delay: 2000,
    onLongPress: () => {
      if (onLongPress) onLongPress(medication);
    },
    onClick: () => {
      if (selectionMode && onToggleSelect) onToggleSelect(medication);
    },
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: selectionMode ? 1.02 : 1,
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      {...longPress}
      className={cn(
        "flex items-center gap-4 rounded-3xl bg-card p-4 shadow-float select-none",
        selectionMode && "ring-2 ring-offset-2 ring-offset-background",
        selectionMode && (selected ? "ring-primary" : "ring-border"),
      )}
    >
      {selectionMode && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
            selected
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background",
          )}
        >
          {selected && <Check className="h-4 w-4" strokeWidth={3.5} />}
        </motion.div>
      )}

      <div
        className={cn(
          "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl",
          tintClass,
        )}
      >
        <Icon className={cn("h-7 w-7", iconClass)} strokeWidth={2.25} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <h3 className="truncate text-base font-semibold text-foreground">{medication.name}</h3>
          <span className="text-sm font-medium text-muted-foreground">{medication.dose}</span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5" strokeWidth={2.25} />
          <span>{formatTime(medication.scheduledAt)}</span>
          {status === "taken" && medication.takenAt && (
            <span className="ml-1 text-success">· logged {formatTime(medication.takenAt)}</span>
          )}
        </div>
      </div>

      {!selectionMode && (
        <StatusControl status={status} onClick={() => onRequestLog(medication)} />
      )}
    </motion.div>
  );
}

function StatusControl({
  status,
  onClick,
}: {
  status: ReturnType<typeof getMedicationStatus>;
  onClick: () => void;
}) {
  if (status === "taken") {
    return (
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-success text-success-foreground shadow-sm">
        <Check className="h-5 w-5" strokeWidth={3} />
      </div>
    );
  }

  const isMissed = status === "missed";

  return (
    <motion.button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      whileTap={{ scale: 0.93 }}
      whileHover={{ scale: 1.03 }}
      className={cn(
        "flex h-11 items-center gap-1.5 rounded-2xl px-3.5 text-sm font-semibold shadow-sm transition-colors",
        isMissed
          ? "bg-danger text-danger-foreground hover:bg-danger/90"
          : "bg-warning text-warning-foreground hover:bg-warning/90",
      )}
    >
      {isMissed ? (
        <>
          <AlertCircle className="h-4 w-4" strokeWidth={2.5} />
          Missed
        </>
      ) : (
        "Take"
      )}
    </motion.button>
  );
}
