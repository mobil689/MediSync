import { motion } from "framer-motion";
import { Flame } from "lucide-react";

export function AdherenceRing({
  percent = 85,
  taken,
  total,
}: {
  percent?: number;
  taken?: number;
  total?: number;
}) {
  const size = 120;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;

  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-card p-4 shadow-float">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="var(--success-tint)"
            strokeWidth={stroke}
            fill="none"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="var(--success)"
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-success">{percent}%</span>
        </div>
      </div>
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Daily Success
      </span>
      {typeof taken === "number" && typeof total === "number" ? (
        <span className="text-[11px] font-medium text-muted-foreground">
          {taken}/{total} Meds Taken Today
        </span>
      ) : null}
    </div>
  );
}

export function StreakCard({ days = 5 }: { days?: number }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-card p-4 shadow-float">
      <motion.div
        initial={{ scale: 0.8, rotate: -8 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 14 }}
        className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-warning-tint"
      >
        <Flame className="h-9 w-9 text-warning-foreground" strokeWidth={2.25} fill="currentColor" />
      </motion.div>
      <div className="text-center">
        <div className="text-2xl font-bold text-foreground">{days} Day</div>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Streak!
        </div>
      </div>
    </div>
  );
}
