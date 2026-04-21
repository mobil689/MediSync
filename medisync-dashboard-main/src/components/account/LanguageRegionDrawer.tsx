import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

const LANGUAGES = [
  "English",
  "Hindi",
  "Bengali",
  "Telugu",
  "Marathi",
  "Tamil",
  "Urdu",
  "Gujarati",
  "Kannada",
  "Odia",
  "Malayalam",
  "Punjabi",
];

const REGIONS = [
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Singapore",
  "United Arab Emirates",
  "Japan",
];

interface Props {
  open: boolean;
  onClose: () => void;
  language: string;
  region: string;
  onSelectLanguage: (l: string) => void;
  onSelectRegion: (r: string) => void;
}

export function LanguageRegionDrawer({
  open,
  onClose,
  language,
  region,
  onSelectLanguage,
  onSelectRegion,
}: Props) {
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
            className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-hidden rounded-t-3xl bg-card shadow-float-lg"
          >
            <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
              <h2 className="text-lg font-bold text-foreground">Language & Region</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[70vh] space-y-5 overflow-y-auto px-5 py-4">
              <section>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Language
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map((l) => {
                    const active = l === language;
                    return (
                      <button
                        key={l}
                        type="button"
                        onClick={() => onSelectLanguage(l)}
                        className={cn(
                          "flex min-h-[44px] items-center justify-between rounded-xl border px-3 text-sm font-medium",
                          active
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-background text-foreground",
                        )}
                      >
                        {l}
                        {active && <Check className="h-4 w-4" />}
                      </button>
                    );
                  })}
                </div>
              </section>
              <section>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Region
                </h3>
                <select
                  value={region}
                  onChange={(e) => onSelectRegion(e.target.value)}
                  className="min-h-[48px] w-full rounded-xl border border-border bg-background px-3 text-base font-medium text-foreground"
                >
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
