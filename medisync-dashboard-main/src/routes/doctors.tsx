import { createFileRoute } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { StubScreen } from "@/components/layout/StubScreen";

export const Route = createFileRoute("/doctors")({
  head: () => ({
    meta: [
      { title: "Doctors Near Me — MediSync AI" },
      { name: "description", content: "Find and book trusted doctors close to you." },
    ],
  }),
  component: () => (
    <StubScreen
      Icon={MapPin}
      title="Doctors Near Me"
      description="Premium doctor cards with ratings, distance, and one-tap booking will appear here, animated with a staggered entrance."
    />
  ),
});
