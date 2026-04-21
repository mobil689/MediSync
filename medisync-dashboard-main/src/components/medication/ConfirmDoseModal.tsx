import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { useEffect } from "react";
import type { Medication } from "@/contexts/MedicationContext";

interface ConfirmDoseModalProps {
  medication: Medication | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDoseModal({ medication, onConfirm, onCancel }: ConfirmDoseModalProps) {
  useEffect(() => {
    if (!medication) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [medication, onCancel]);

  return (
    <AnimatePresence>
      {medication && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={onCancel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-dose-title"
            initial={{ y: "100%", opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="relative w-full max-w-md rounded-t-3xl bg-card p-6 shadow-float-lg sm:rounded-3xl"
          >
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-border sm:hidden" />

            <h2 id="confirm-dose-title" className="text-xl font-bold text-foreground">
              Confirm dose
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Did you take{" "}
              <span className="font-semibold text-foreground">
                {medication.dose} of {medication.name}
              </span>
              ? This will be logged as taken now.
            </p>

            <div className="mt-6 flex gap-3">
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={onCancel}
                className="flex h-12 flex-1 items-center justify-center gap-1.5 rounded-2xl border border-border bg-background text-sm font-semibold text-foreground"
              >
                <X className="h-4 w-4" strokeWidth={2.5} />
                Cancel
              </motion.button>
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={onConfirm}
                className="flex h-12 flex-1 items-center justify-center gap-1.5 rounded-2xl bg-success text-sm font-semibold text-success-foreground shadow-sm"
              >
                <Check className="h-4 w-4" strokeWidth={3} />
                Yes, log it
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
