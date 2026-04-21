import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useMedications } from "@/contexts/MedicationContext";
import {
  Bell,
  Camera,
  Check,
  Download,
  Globe,
  HeartPulse,
  LogOut,
  Watch,
} from "lucide-react";
import { AdherenceRing, StreakCard } from "@/components/account/StatsCards";
import { SettingsRow } from "@/components/account/SettingsRow";
import {
  LanguageRegionDrawer,
} from "@/components/account/LanguageRegionDrawer";
import {
  NotificationsDrawer,
  type NotifPrefs,
} from "@/components/account/NotificationsDrawer";
import { MedicalReportsDrawer } from "@/components/account/MedicalReportsDrawer";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Account — MediSync AI" },
      { name: "description", content: "Your profile, adherence report, and settings." },
    ],
  }),
  component: AccountScreen,
});



function AccountScreen() {
  const { medications } = useMedications();

  const { takenCount, total, percent } = useMemo(() => {
    const tot = medications.length;
    const t = medications.filter((m) => m.takenAt).length;
    return {
      takenCount: t,
      total: tot,
      percent: tot === 0 ? 0 : Math.round((t / tot) * 100),
    };
  }, [medications]);

  // Settings state
  const [language, setLanguage] = useState("English");
  const [region, setRegion] = useState("India");
  const [langOpen, setLangOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  const [notifPrefs, setNotifPrefs] = useState<NotifPrefs>({
    push: true,
    email: false,
    refillReminders: true,
    missedDose: true,
  });

  const toggleNotif = (k: keyof NotifPrefs) =>
    setNotifPrefs((p) => ({ ...p, [k]: !p[k] }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-[oklch(0.97_0.03_265)] pb-32">
      <div className="mx-auto max-w-md space-y-5 px-5 pt-10">
        <ProfileHeader />
        <StatsGrid percent={percent} taken={takenCount} total={total} />
        <EmergencyMedicalID />
        <SettingsCard
          language={language}
          notifPush={notifPrefs.push}
          onOpenLanguage={() => setLangOpen(true)}
          onOpenNotifications={() => setNotifOpen(true)}
          onOpenReports={() => setReportsOpen(true)}
        />
        <LogOutButton />
      </div>

      <LanguageRegionDrawer
        open={langOpen}
        onClose={() => setLangOpen(false)}
        language={language}
        region={region}
        onSelectLanguage={setLanguage}
        onSelectRegion={setRegion}
      />
      <NotificationsDrawer
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        prefs={notifPrefs}
        onToggle={toggleNotif}
      />
      <MedicalReportsDrawer open={reportsOpen} onClose={() => setReportsOpen(false)} />
    </div>
  );
}

function ProfileHeader() {
  // TODO (BACKEND): Wire up Clerk user profile data here
  return (
    <header className="flex flex-col items-center pt-2 text-center">
      <div className="relative">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[oklch(0.62_0.22_295)] text-3xl font-bold text-primary-foreground shadow-float-lg">
          EV
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          aria-label="Change profile photo"
          className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border-4 border-background bg-card text-foreground shadow-float"
        >
          <Camera className="h-4 w-4" strokeWidth={2.5} />
        </motion.button>
      </div>
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">Eleanor Vance</h1>
      <p className="mt-1 text-sm text-muted-foreground">eleanor.vance@example.com</p>
    </header>
  );
}

function StatsGrid({
  percent,
  taken,
  total,
}: {
  percent: number;
  taken: number;
  total: number;
}) {
  return (
    <section aria-label="Health stats" className="grid grid-cols-2 gap-3">
      <AdherenceRing percent={percent} taken={taken} total={total} />
      <StreakCard days={5} />
    </section>
  );
}

interface EmergencyData {
  bloodType: string;
  allergies: string;
  contactName: string;
  contactPhone: string;
}

function EmergencyMedicalID() {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState<EmergencyData>({
    bloodType: "O+",
    allergies: "Penicillin",
    contactName: "John (Son)",
    contactPhone: "+1 (555) 234-9087",
  });
  const [draft, setDraft] = useState<EmergencyData>(data);

  const startEdit = () => {
    setDraft(data);
    setIsEditing(true);
  };
  const save = () => {
    setData(draft);
    setIsEditing(false);
  };

  return (
    <section className="rounded-2xl bg-danger-tint p-5 shadow-float">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger text-danger-foreground shadow-sm">
            <HeartPulse className="h-5 w-5" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">Emergency Medical ID</h2>
            <p className="text-xs text-muted-foreground">Visible on lock screen</p>
          </div>
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.94 }}
          onClick={isEditing ? save : startEdit}
          className={
            "flex min-h-[36px] items-center gap-1 rounded-full px-3 text-sm font-semibold " +
            (isEditing
              ? "bg-success text-success-foreground"
              : "bg-card/70 text-danger")
          }
        >
          {isEditing && <Check className="h-4 w-4" strokeWidth={3} />}
          {isEditing ? "Save" : "Edit"}
        </motion.button>
      </div>
      <dl className="space-y-2 rounded-xl bg-card/60 p-3">
        <SimpleField
          label="Blood Type"
          value={data.bloodType}
          isEditing={isEditing}
          onChange={(v) => setDraft((d) => ({ ...d, bloodType: v }))}
          draft={draft.bloodType}
          divider
        />
        <SimpleField
          label="Allergies"
          value={data.allergies}
          isEditing={isEditing}
          onChange={(v) => setDraft((d) => ({ ...d, allergies: v }))}
          draft={draft.allergies}
          divider
        />
        <div className="py-1">
          <dt className="mb-1 text-sm text-muted-foreground">Emergency Contact</dt>
          {isEditing ? (
            <div className="space-y-2">
              <input
                value={draft.contactName}
                onChange={(e) => setDraft((d) => ({ ...d, contactName: e.target.value }))}
                placeholder="Name"
                className="min-h-[36px] w-full rounded-lg border border-danger/30 bg-card px-2 text-sm font-semibold text-foreground focus:border-danger focus:outline-none"
              />
              <input
                value={draft.contactPhone}
                onChange={(e) => setDraft((d) => ({ ...d, contactPhone: e.target.value }))}
                placeholder="Phone number"
                inputMode="tel"
                className="min-h-[36px] w-full rounded-lg border border-danger/30 bg-card px-2 text-sm font-semibold text-foreground focus:border-danger focus:outline-none"
              />
            </div>
          ) : (
            <dd className="text-right">
              <p className="text-sm font-semibold text-foreground">{data.contactName}</p>
              <p className="text-xs font-medium text-muted-foreground">{data.contactPhone}</p>
            </dd>
          )}
        </div>
      </dl>
    </section>
  );
}

function SimpleField({
  label,
  value,
  draft,
  isEditing,
  onChange,
  divider,
}: {
  label: string;
  value: string;
  draft: string;
  isEditing: boolean;
  onChange: (v: string) => void;
  divider?: boolean;
}) {
  return (
    <div
      className={
        "flex items-center justify-between gap-3 py-1" +
        (divider ? " border-b border-danger/10 pb-2" : "")
      }
    >
      <dt className="shrink-0 text-sm text-muted-foreground">{label}</dt>
      <dd className="min-w-0 flex-1 text-right">
        {isEditing ? (
          <input
            value={draft}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-[36px] w-full rounded-lg border border-danger/30 bg-card px-2 text-right text-sm font-semibold text-foreground focus:border-danger focus:outline-none"
          />
        ) : (
          <span className="text-sm font-semibold text-foreground">{value}</span>
        )}
      </dd>
    </div>
  );
}

function SettingsCard({
  language,
  notifPush,
  onOpenLanguage,
  onOpenNotifications,
  onOpenReports,
}: {
  language: string;
  notifPush: boolean;
  onOpenLanguage: () => void;
  onOpenNotifications: () => void;
  onOpenReports: () => void;
}) {
  const rows = [
    {
      Icon: Bell,
      label: "Notification Preferences",
      tintClass: "bg-info-tint",
      iconClass: "text-primary",
      value: notifPush ? "Push: ON" : "Push: OFF",
      onClick: onOpenNotifications,
    },
    {
      Icon: Watch,
      label: "Connected Devices",
      tintClass: "bg-violet-tint",
      iconClass: "text-[oklch(0.45_0.18_295)]",
    },
    {
      Icon: Download,
      label: "Medical Reports",
      tintClass: "bg-success-tint",
      iconClass: "text-success",
      onClick: onOpenReports,
    },
    {
      Icon: Globe,
      label: "Language & Region",
      tintClass: "bg-warning-tint",
      iconClass: "text-warning-foreground",
      value: language,
      onClick: onOpenLanguage,
    },
  ];

  return (
    <section
      aria-label="Preferences"
      className="overflow-hidden rounded-2xl bg-card shadow-float"
    >
      {rows.map((row, i) => (
        <SettingsRow key={row.label} {...row} isLast={i === rows.length - 1} />
      ))}
    </section>
  );
}

function LogOutButton() {
  const handleLogOut = () => {
    // TODO (BACKEND): Wire up Clerk signOut() here
  };

  return (
    <motion.button
      type="button"
      onClick={handleLogOut}
      whileTap={{ scale: 0.98 }}
      className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl border border-danger/30 bg-card text-base font-semibold text-danger shadow-sm"
    >
      <LogOut className="h-5 w-5" strokeWidth={2.5} />
      Log Out
    </motion.button>
  );
}
