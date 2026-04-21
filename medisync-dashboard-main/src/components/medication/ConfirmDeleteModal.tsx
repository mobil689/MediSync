import { AnimatePresence, motion } from "framer-motion";
import { Trash2, X } from "lucide-react";
import { useEffect } from "react";

interface ConfirmDeleteModalProps {
  open: boolean;
  count: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDeleteModal({ open, count, onConfirm, onCancel }: ConfirmDeleteModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center"
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
            initial={{ y: "100%", opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="relative w-full max-w-md rounded-t-3xl bg-card p-6 shadow-float-lg sm:rounded-3xl"
          >
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-border sm:hidden" />

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-danger-tint text-danger">
              <Trash2 className="h-6 w-6" strokeWidth={2.25} />
            </div>
            <h2 className="text-xl font-bold text-foreground">Delete selected schedules?</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {count === 1
                ? "This medication schedule will be permanently removed."
                : `${count} medication schedules will be permanently removed.`}{" "}
              You can always add them back later.
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
                className="flex h-12 flex-1 items-center justify-center gap-1.5 rounded-2xl bg-danger text-sm font-semibold text-danger-foreground shadow-sm"
              >
                <Trash2 className="h-4 w-4" strokeWidth={2.5} />
                Delete
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
