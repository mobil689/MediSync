import { AnimatePresence, motion } from "framer-motion";
import { ImagePlus, X, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { TimeOfDay } from "@/contexts/MedicationContext";

interface AddMedicationDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; dose: string; timesOfDay: TimeOfDay[]; photo: string | null }) => void;
}

const TIME_PILLS: { value: TimeOfDay; label: string; sub: string }[] = [
  { value: "morning", label: "Morning", sub: "AM" },
  { value: "afternoon", label: "Midday", sub: "PM" },
  { value: "evening", label: "Evening", sub: "PM" },
  { value: "night", label: "Night", sub: "PM" },
];

export function AddMedicationDrawer({ open, onClose, onSubmit }: AddMedicationDrawerProps) {
  const [name, setName] = useState("");
  const [dose, setDose] = useState("");
  const [times, setTimes] = useState<TimeOfDay[]>([]);
  const [photo, setPhoto] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      // reset shortly after close so the exit animation isn't janky
      const t = setTimeout(() => {
        setName("");
        setDose("");
        setTimes([]);
        setPhoto(null);
      }, 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  const toggleTime = (t: TimeOfDay) => {
    setTimes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
  };

  const canSubmit = name.trim().length > 0 && dose.trim().length > 0 && times.length > 0;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-med-title"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-card p-6 shadow-float-lg sm:rounded-3xl"
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-border sm:hidden" />

            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id="add-med-title" className="text-xl font-bold text-foreground">
                  Add medication
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  We'll add it to today's schedule.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground"
              >
                <X className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>

            <div className="mt-6 space-y-5">
              <Field label="Name">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Lisinopril"
                  className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-base text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </Field>

              <Field label="Dose">
                <input
                  type="text"
                  value={dose}
                  onChange={(e) => setDose(e.target.value)}
                  placeholder="e.g. 10 mg"
                  className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-base text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </Field>

              <Field label="Photo (optional)">
                <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => fileRef.current?.click()}
                  className="flex h-28 w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-muted/40 text-sm font-medium text-muted-foreground hover:border-primary/50 hover:text-primary"
                >
                  {photo ? (
                    <img src={photo} alt="Medication" className="h-full rounded-xl object-cover" />
                  ) : (
                    <>
                      <ImagePlus className="h-5 w-5" strokeWidth={2.25} />
                      Tap to upload pill photo
                    </>
                  )}
                </motion.button>
              </Field>

              <Field label="When">
                <div className="grid grid-cols-2 gap-2">
                  {TIME_PILLS.map((p) => {
                    const active = times.includes(p.value);
                    return (
                      <motion.button
                        key={p.value}
                        type="button"
                        whileTap={{ scale: 0.96 }}
                        onClick={() => toggleTime(p.value)}
                        className={cn(
                          "flex h-14 items-center justify-between rounded-2xl border px-4 text-sm font-semibold transition-colors",
                          active
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-background text-foreground",
                        )}
                      >
                        <span>{p.label}</span>
                        <span
                          className={cn(
                            "text-xs font-bold",
                            active ? "text-primary" : "text-muted-foreground",
                          )}
                        >
                          {p.sub}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </Field>
            </div>

            <motion.button
              type="button"
              whileTap={{ scale: canSubmit ? 0.97 : 1 }}
              disabled={!canSubmit}
              onClick={() => {
                onSubmit({ name: name.trim(), dose: dose.trim(), timesOfDay: times, photo });
                onClose();
              }}
              className={cn(
                "mt-7 flex h-13 w-full items-center justify-center gap-2 rounded-2xl text-base font-semibold shadow-sm transition-opacity",
                "bg-gradient-to-r from-primary to-[oklch(0.62_0.22_295)] text-primary-foreground",
                !canSubmit && "opacity-50",
              )}
              style={{ height: "3.25rem" }}
            >
              <Check className="h-5 w-5" strokeWidth={3} />
              Save medication
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
