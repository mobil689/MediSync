import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { MedicationCard } from "@/components/medication/MedicationCard";
import { ConfirmDoseModal } from "@/components/medication/ConfirmDoseModal";
import { ConfirmDeleteModal } from "@/components/medication/ConfirmDeleteModal";
import { AddMedicationDrawer } from "@/components/medication/AddMedicationDrawer";
import { useMedications, type Medication } from "@/contexts/MedicationContext";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Today — MediSync AI" },
      {
        name: "description",
        content: "Your medication schedule for today, with one-tap logging.",
      },
    ],
  }),
  component: HomeScreen,
});

function HomeScreen() {
  const { medications, logDose, addMedication, removeMedications } = useMedications();
  const [pending, setPending] = useState<Medication | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [confirmDelete, setConfirmDelete] = useState(false);

  const greeting = getGreeting();
  const takenCount = medications.filter((m) => m.takenAt).length;

  const enterSelection = (med: Medication) => {
    setSelectionMode(true);
    setSelectedIds(new Set([med.id]));
  };

  const exitSelection = () => {
    setSelectionMode(false);
    setSelectedIds(new Set());
  };

  const toggleSelect = (med: Medication) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(med.id)) next.delete(med.id);
      else next.add(med.id);
      return next;
    });
  };

  const confirmDeletion = () => {
    removeMedications(Array.from(selectedIds));
    setConfirmDelete(false);
    exitSelection();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-[oklch(0.97_0.03_265)] pb-32">
      <div className="mx-auto max-w-md px-5 pt-10">
        <header>
          <p className="text-sm font-medium text-muted-foreground">{formatToday()}</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
            {greeting}, Alex
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{takenCount}</span> of{" "}
            <span className="font-semibold text-foreground">{medications.length}</span> doses
            logged today
          </p>
        </header>

        <section className="mt-7">
          <div className="mb-3 flex items-center justify-between px-1">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {selectionMode
                ? `${selectedIds.size} selected · hold to select more`
                : "Today's schedule"}
            </h2>
            {selectionMode && (
              <motion.button
                type="button"
                onClick={exitSelection}
                whileTap={{ scale: 0.94 }}
                className="text-xs font-semibold text-primary"
              >
                Cancel
              </motion.button>
            )}
          </div>
          <div className="flex flex-col gap-3">
            {medications.map((med) => (
              <MedicationCard
                key={med.id}
                medication={med}
                onRequestLog={setPending}
                selectionMode={selectionMode}
                selected={selectedIds.has(med.id)}
                onLongPress={enterSelection}
                onToggleSelect={toggleSelect}
              />
            ))}
          </div>
          {!selectionMode && medications.length > 0 && (
            <p className="mt-3 px-1 text-[11px] text-muted-foreground">
              Tip: hold a card for 2 seconds to select &amp; delete.
            </p>
          )}
        </section>
      </div>

      {/* Trash icon — only in selection mode, top-right */}
      <AnimatePresence>
        {selectionMode && (
          <motion.button
            type="button"
            key="trash-fab"
            initial={{ opacity: 0, scale: 0.7, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: -8 }}
            whileTap={{ scale: 0.92 }}
            disabled={selectedIds.size === 0}
            onClick={() => setConfirmDelete(true)}
            aria-label="Delete selected"
            className="fixed right-5 top-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-danger text-danger-foreground shadow-float-lg disabled:opacity-40"
          >
            <Trash2 className="h-5 w-5" strokeWidth={2.5} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Add FAB — hidden in selection mode */}
      {!selectionMode && (
        <motion.button
          type="button"
          onClick={() => setDrawerOpen(true)}
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.05 }}
          aria-label="Add medication"
          className="fixed bottom-24 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[oklch(0.62_0.22_295)] text-primary-foreground shadow-float-lg"
        >
          <Plus className="h-6 w-6" strokeWidth={2.75} />
        </motion.button>
      )}

      <ConfirmDoseModal
        medication={pending}
        onCancel={() => setPending(null)}
        onConfirm={() => {
          if (pending) logDose(pending.id);
          setPending(null);
        }}
      />

      <ConfirmDeleteModal
        open={confirmDelete}
        count={selectedIds.size}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={confirmDeletion}
      />

      <AddMedicationDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={(data) => addMedication(data)}
      />

    </div>
  );
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function formatToday(): string {
  return new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}
