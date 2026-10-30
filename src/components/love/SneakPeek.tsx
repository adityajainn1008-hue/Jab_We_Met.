import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Character } from "./Character";
import { sneakLines } from "@/content/story";
import { sfx } from "@/lib/sound";

type Side = "left" | "right" | "bottom";
interface Peek { side: Side; who: "aditya" | "ritu"; at: number; line: string }

export function SneakPeek() {
  const [peek, setPeek] = useState<Peek | null>(null);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (peek) return;
    const t = setTimeout(() => {
      const sides: Side[] = ["left", "right", "bottom"];
      setPeek({
        side: sides[Math.floor(Math.random() * 3)]!,
        who: Math.random() < 0.5 ? "aditya" : "ritu",
        at: 20 + Math.random() * 55,
        line: sneakLines[Math.floor(Math.random() * sneakLines.length)]!,
      });
      setOpened(false);
    }, 8000 + Math.random() * 10000);
    return () => clearTimeout(t);
  }, [peek]);

  useEffect(() => {
    if (!peek || opened) return;
    const t = setTimeout(() => setPeek(null), 7000);
    return () => clearTimeout(t);
  }, [peek, opened]);

  if (!peek) return null;
  const { side, at } = peek;
  const hidden = side === "left" ? { x: -140 } : side === "right" ? { x: 140 } : { y: 160 };
  const shown = side === "bottom" ? { y: 30 } : { x: side === "left" ? -30 : 30 };
  const place = side === "bottom" ? { bottom: 0, left: `${at}%` } : { top: `${at}%`, [side]: 0 };
  const rotate = side === "left" ? 20 : side === "right" ? -20 : 0;

  return (
    <AnimatePresence>
      <motion.div key={peek.line} className="fixed z-[55]" style={place} initial={hidden} animate={shown} exit={hidden} transition={{ type: "spring", stiffness: 120, damping: 14 }}>
        <div className="relative">
          <AnimatePresence mode="wait">
            {!opened ? (
              <motion.button key="tap" initial={{ scale: 0 }} animate={{ scale: [1, 1.12, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}
                onClick={() => { sfx.pop(); setOpened(true); }}
                className={`absolute -top-10 whitespace-nowrap rounded-full bg-glow px-4 py-1.5 font-hand text-lg text-primary-foreground shadow-glow ${side === "right" ? "right-8" : "left-8"}`}>
                tap me 👀
              </motion.button>
            ) : (
              <motion.div key="msg" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className={`absolute -top-28 w-60 rounded-3xl border border-rose/40 bg-card p-4 text-center shadow-glow ${side === "right" ? "right-6" : side === "left" ? "left-6" : "left-1/2 -translate-x-1/2"}`}>
                <p className="font-display text-base italic leading-snug text-burgundy">{peek.line}</p>
                <button onClick={() => { sfx.click(); setPeek(null); }} className="mt-2 text-sm font-semibold text-rose">aww 💕</button>
              </motion.div>
            )}
          </AnimatePresence>
          <button onClick={() => { if (!opened) { sfx.pop(); setOpened(true); } }} aria-label="sneaky character" style={{ transform: `rotate(${rotate}deg)` }}>
            <Character who={peek.who} pose={opened ? "shy" : "wave"} flip={side === "right"} size={90} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
