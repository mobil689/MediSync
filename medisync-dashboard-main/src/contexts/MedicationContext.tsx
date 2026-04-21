import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

export interface Medication {
  id: string;
  name: string;
  dose: string;
  scheduledAt: string; // ISO timestamp for today's dose
  timeOfDay: TimeOfDay;
  takenAt: string | null; // ISO timestamp once logged
  photo?: string | null;
}

export interface NewMedicationInput {
  name: string;
  dose: string;
  timesOfDay: TimeOfDay[];
  photo?: string | null;
}

interface MedicationContextValue {
  medications: Medication[];
  logDose: (id: string) => void;
  undoDose: (id: string) => void;
  addMedication: (input: NewMedicationInput) => void;
  removeMedications: (ids: string[]) => void;
}

const MedicationContext = createContext<MedicationContextValue | null>(null);
const STORAGE_KEY = "medisync.medications.v1";

const TIME_HOURS: Record<TimeOfDay, [number, number]> = {
  morning: [8, 0],
  afternoon: [13, 0],
  evening: [18, 30],
  night: [22, 0],
};

function todayAt(hour: number, minute = 0): string {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function getSeedData(): Medication[] {
  return [
    {
      id: "med-1",
      name: "Lisinopril",
      dose: "10 mg",
      scheduledAt: todayAt(8, 0),
      timeOfDay: "morning",
      takenAt: null,
    },
    {
      id: "med-2",
      name: "Metformin",
      dose: "500 mg",
      scheduledAt: todayAt(13, 0),
      timeOfDay: "afternoon",
      takenAt: new Date(new Date().setHours(13, 4, 0, 0)).toISOString(),
    },
    {
      id: "med-3",
      name: "Atorvastatin",
      dose: "20 mg",
      scheduledAt: todayAt(7, 30),
      timeOfDay: "morning",
      takenAt: null,
    },
  ];
}

export function MedicationProvider({ children }: { children: ReactNode }) {
  const [medications, setMedications] = useState<Medication[]>(() => {
    if (typeof window === "undefined") return getSeedData();
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return getSeedData();
      const parsed = JSON.parse(raw) as Medication[];
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : getSeedData();
    } catch {
      return getSeedData();
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(medications));
    } catch {
      /* storage unavailable — ignore */
    }
  }, [medications]);

  const logDose = useCallback((id: string) => {
    setMedications((prev) =>
      prev.map((m) => (m.id === id ? { ...m, takenAt: new Date().toISOString() } : m)),
    );
  }, []);

  const undoDose = useCallback((id: string) => {
    setMedications((prev) => prev.map((m) => (m.id === id ? { ...m, takenAt: null } : m)));
  }, []);

  const addMedication = useCallback((input: NewMedicationInput) => {
    setMedications((prev) => {
      const created: Medication[] = input.timesOfDay.map((t, i) => {
        const [h, m] = TIME_HOURS[t];
        return {
          id: `med-${Date.now()}-${i}`,
          name: input.name,
          dose: input.dose,
          scheduledAt: todayAt(h, m),
          timeOfDay: t,
          takenAt: null,
          photo: input.photo ?? null,
        };
      });
      return [...prev, ...created].sort(
        (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
      );
    });
  }, []);

  const removeMedications = useCallback((ids: string[]) => {
    if (ids.length === 0) return;
    const set = new Set(ids);
    setMedications((prev) => prev.filter((m) => !set.has(m.id)));
  }, []);

  const value = useMemo(
    () => ({ medications, logDose, undoDose, addMedication, removeMedications }),
    [medications, logDose, undoDose, addMedication, removeMedications],
  );

  return <MedicationContext.Provider value={value}>{children}</MedicationContext.Provider>;
}

export function useMedications() {
  const ctx = useContext(MedicationContext);
  if (!ctx) throw new Error("useMedications must be used within MedicationProvider");
  return ctx;
}

export type MedicationStatus = "taken" | "missed" | "pending";

export function getMedicationStatus(med: Medication, now: Date = new Date()): MedicationStatus {
  if (med.takenAt) return "taken";
  if (new Date(med.scheduledAt).getTime() < now.getTime()) return "missed";
  return "pending";
}
