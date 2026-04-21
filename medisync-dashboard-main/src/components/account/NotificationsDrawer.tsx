import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NotifPrefs {
  push: boolean;
  email: boolean;
  refillReminders: boolean;
  missedDose: boolean;
}

interface Props {
  open: boolean;
  onClose: () => void;
  prefs: NotifPrefs;
  onToggle: (key: keyof NotifPrefs) => void;
}

const ROWS: { key: keyof NotifPrefs; label: string; desc: string }[] = [
  { key: "push", label: "Push Notifications", desc: "Dose times and alerts on your device" },
  { key: "email", label: "Email Updates", desc: "Weekly summary and important changes" },
  { key: "refillReminders", label: "Refill Reminders", desc: "Get notified when supply is low" },
  { key: "missedDose", label: "Missed Dose Alerts", desc: "Nudge if you forget a scheduled dose" },
];

export function NotificationsDrawer({ open, onClose, prefs, onToggle }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed inset-x-0 bottom-0 z-50 overflow-hidden rounded-t-3xl bg-card shadow-float-lg"
          >
            <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
              <h2 className="text-lg font-bold text-foreground">Notification Preferences</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="divide-y divide-border/60 px-2 py-2">
              {ROWS.map((r) => {
                const on = prefs[r.key];
                return (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => onToggle(r.key)}
                    className="flex w-full items-center gap-4 rounded-xl px-3 py-3 text-left"
                  >
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-foreground">{r.label}</div>
                      <div className="text-xs text-muted-foreground">{r.desc}</div>
                      <div
                        className={cn(
                          "mt-1 text-[11px] font-bold uppercase tracking-wider",
                          on ? "text-success" : "text-muted-foreground",
                        )}
                      >
                        {on ? "ON" : "OFF"}
                      </div>
                    </div>
                    <span
                      className={cn(
                        "relative h-7 w-12 shrink-0 rounded-full transition-colors",
                        on ? "bg-success" : "bg-muted",
                      )}
                    >
                      <motion.span
                        layout
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className={cn(
                          "absolute top-0.5 h-6 w-6 rounded-full bg-white shadow",
                          on ? "right-0.5" : "left-0.5",
                        )}
                      />
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="px-5 pb-6 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[48px] w-full rounded-xl bg-primary text-base font-semibold text-primary-foreground"
              >
                Done
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
