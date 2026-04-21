import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Home, Stethoscope, MapPin, User, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Tab {
  to: "/" | "/triage" | "/doctors" | "/account";
  label: string;
  Icon: LucideIcon;
}

const TABS: Tab[] = [
  { to: "/", label: "Today", Icon: Home },
  { to: "/triage", label: "Triage", Icon: Stethoscope },
  { to: "/doctors", label: "Doctors", Icon: MapPin },
  { to: "/account", label: "Account", Icon: User },
];

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-card/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl"
    >
      <ul className="mx-auto flex max-w-md items-center justify-around px-3 py-2">
        {TABS.map(({ to, label, Icon }) => {
          const isActive = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                aria-current={isActive ? "page" : undefined}
                className="relative flex flex-col items-center justify-center gap-0.5 rounded-2xl py-1.5"
              >
                <div className="relative flex h-10 w-16 items-center justify-center">
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-primary/12"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <Icon
                    className={cn(
                      "relative h-5 w-5 transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground",
                    )}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </div>
                <span
                  className={cn(
                    "text-[11px] font-semibold transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
