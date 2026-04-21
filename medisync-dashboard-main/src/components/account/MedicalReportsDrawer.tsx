import { AnimatePresence, motion } from "framer-motion";
import { FileText, UploadCloud, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface MedicalReportsDrawerProps {
  open: boolean;
  onClose: () => void;
}

interface MockFile {
  name: string;
  size: string;
}

const SEED_FILES: MockFile[] = [
  { name: "Blood_Test_April.pdf", size: "1.2 MB" },
  { name: "MRI_Spine_Report.pdf", size: "3.4 MB" },
  { name: "Prescription_Lisinopril.jpg", size: "820 KB" },
];

export function MedicalReportsDrawer({ open, onClose }: MedicalReportsDrawerProps) {
  const [files, setFiles] = useState<MockFile[]>(SEED_FILES);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleFiles = (list: FileList | null) => {
    if (!list) return;
    // TODO (BACKEND): Wire up file storage/bucket upload here.
    const added: MockFile[] = Array.from(list).map((f) => ({
      name: f.name,
      size: `${(f.size / 1024).toFixed(0)} KB`,
    }));
    setFiles((prev) => [...added, ...prev]);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center"
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
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            className="relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-card p-6 shadow-float-lg"
          >
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-border" />

            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-foreground">Medical Reports</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Securely store prescriptions and test results
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

            {/* Dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                handleFiles(e.dataTransfer.files);
              }}
              onClick={() => inputRef.current?.click()}
              className={
                "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 py-8 text-center transition-colors " +
                (dragOver
                  ? "border-primary bg-info-tint"
                  : "border-border bg-background hover:bg-muted/40")
              }
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-info-tint text-primary">
                <UploadCloud className="h-6 w-6" strokeWidth={2.25} />
              </div>
              <p className="text-sm font-semibold text-foreground">
                Drag & drop or click to upload
              </p>
              <p className="mt-1 text-xs text-muted-foreground">PDF, JPG, PNG · up to 10 MB</p>
              <input
                ref={inputRef}
                type="file"
                multiple
                accept=".pdf,image/*"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </div>

            {/* Files list */}
            <div className="mt-5">
              <h3 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Recent uploads
              </h3>
              <ul className="overflow-hidden rounded-2xl bg-background">
                {files.map((f, i) => (
                  <motion.li
                    key={`${f.name}-${i}`}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={
                      "flex items-center gap-3 px-3 py-3" +
                      (i < files.length - 1 ? " border-b border-border/60" : "")
                    }
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success-tint text-success">
                      <FileText className="h-5 w-5" strokeWidth={2.25} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{f.name}</p>
                      <p className="text-xs text-muted-foreground">{f.size}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
