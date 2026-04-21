import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Send, Sparkles } from "lucide-react";
import { BodyMap, type BodyZone } from "@/components/triage/BodyMap";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/triage")({
  head: () => ({
    meta: [
      { title: "Triage AI — MediSync AI" },
      { name: "description", content: "Tap a body zone, chat with the AI, get clear next steps." },
    ],
  }),
  component: TriageScreen,
});

interface ChatMessage {
  id: string;
  role: "user" | "ai";
  text: string;
}

function aiReplyFor(zone: BodyZone): string {
  if (zone === "Chest") {
    return "I understand you are having chest discomfort. Is the pain sharp, or does it feel like heavy pressure? Please remember I am an AI, and for severe symptoms, seek immediate emergency care.";
  }
  if (zone === "Head") {
    return "I hear you're having head discomfort. Is it a dull ache, a sharp pain, or pressure behind the eyes? If it's sudden and severe, please seek urgent care.";
  }
  if (zone === "Neck") {
    return "Neck discomfort noted. Is it stiffness, sharp pain when turning, or radiating down an arm? Sudden severe neck pain with fever needs urgent care.";
  }
  if (zone === "Abdomen") {
    return "Abdominal discomfort can have many causes. Is it cramping, burning, or nausea? Note when it started and what you last ate.";
  }
  if (zone === "Pelvis") {
    return "Pelvic discomfort noted. Is it dull, sharp, or related to movement? Let me know any associated symptoms.";
  }
  if (zone === "Upper Back" || zone === "Lower Back") {
    return `${zone} discomfort noted. Is it muscular, or does it shoot down a leg? Sudden severe back pain with numbness needs urgent care.`;
  }
  if (zone.endsWith("Arm")) {
    return `${zone} discomfort noted. Is it muscular soreness, tingling, or weakness? Sudden weakness on one side warrants emergency care.`;
  }
  // Thigh / Calf
  return `${zone} discomfort noted. Is there swelling, warmth, or pain when walking? Sudden swelling in one leg should be evaluated promptly.`;
}

function TriageScreen() {
  const [activeZone, setActiveZone] = useState<BodyZone | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "intro",
      role: "ai",
      text: "Hi, I'm your Triage assistant. Tap any area on the body, or type below to describe what's going on.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const pushAI = (text: string) => {
    setTyping(true);
    // TODO (BACKEND): Replace mock timeout with Gemma 3 (or free open-source) inference API call. Do not use paid APIs.
    window.setTimeout(() => {
      setMessages((m) => [
        ...m,
        { id: `ai-${Date.now()}`, role: "ai", text },
      ]);
      setTyping(false);
    }, 1500);
  };

  const handleZone = (z: BodyZone) => {
    setActiveZone(z);
    setIsChatExpanded(true);
    const userText = `I am experiencing discomfort in my ${z}.`;
    setMessages((m) => [
      ...m,
      { id: `u-${Date.now()}`, role: "user", text: userText },
    ]);
    pushAI(aiReplyFor(z));
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    // TODO (BACKEND): Replace mock timeout with Gemma 3 (or free open-source) inference API call. Do not use paid APIs.
    setMessages((m) => [...m, { id: `u-${Date.now()}`, role: "user", text }]);
    setInput("");
    pushAI(
      "Thanks for sharing. Can you tell me when this started and how severe it feels on a scale of 1–10? I'll use that to suggest next steps.",
    );
  };

  return (
    <div className="flex h-screen flex-col bg-gradient-to-b from-slate-50 to-[oklch(0.97_0.03_265)] pb-20">
      {/* Top: Body Map — collapses in expanded chat mode */}
      <motion.section
        initial={false}
        animate={{ height: isChatExpanded ? 0 : "auto", opacity: isChatExpanded ? 0 : 1 }}
        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
        className="relative shrink-0 overflow-hidden"
      >
        <div className="px-5 pb-3 pt-8">
          <header className="mb-2 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Sparkles className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground">Triage AI</h1>
              <p className="text-[11px] text-muted-foreground">
                Tap a zone — guidance, not diagnosis
              </p>
            </div>
          </header>
          <div className="rounded-2xl bg-card/70 p-3 shadow-float">
            <BodyMap active={activeZone} onSelect={handleZone} />
          </div>
        </div>
      </motion.section>

      {/* Bottom: Chat */}
      <section className="flex min-h-0 flex-1 flex-col px-3">
        <AnimatePresence>
          {isChatExpanded && (
            <motion.div
              key="chat-header"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-2 px-2 pb-1 pt-4"
            >
              <motion.button
                type="button"
                onClick={() => setIsChatExpanded(false)}
                whileTap={{ scale: 0.95 }}
                className="flex min-h-[40px] items-center gap-1.5 rounded-full bg-card px-3 text-sm font-semibold text-foreground shadow-sm"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
                Back to Body Map
              </motion.button>
              <div className="ml-auto flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="h-3 w-3" strokeWidth={2.5} />
                Triage AI
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          ref={scrollRef}
          className="flex-1 space-y-3 overflow-y-auto px-2 py-3"
        >
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
                className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-snug",
                    m.role === "user"
                      ? "rounded-br-sm bg-primary text-primary-foreground"
                      : "rounded-bl-sm bg-card text-foreground shadow-sm",
                  )}
                >
                  {m.text}
                </div>
              </motion.div>
            ))}
            {typing && (
              <motion.div
                key="typing"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-card px-4 py-3 shadow-sm">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                      animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
                      transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="sticky bottom-0 flex items-center gap-2 px-2 pb-3 pt-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsChatExpanded(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            placeholder="Describe your symptoms…"
            className="min-h-[48px] flex-1 rounded-full border border-border bg-card px-4 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
          <motion.button
            type="button"
            onClick={handleSend}
            whileTap={{ scale: 0.92 }}
            aria-label="Send message"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[oklch(0.62_0.22_295)] text-primary-foreground shadow-float-lg"
          >
            <Send className="h-5 w-5" strokeWidth={2.5} />
          </motion.button>
        </div>
      </section>
    </div>
  );
}
