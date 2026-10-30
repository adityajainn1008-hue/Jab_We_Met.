import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "./Ambient";
import { timingSecret } from "@/content/story";
import { sfx } from "@/lib/sound";

const GOAL = 5;

export function PerfectTiming() {
  const [pos, setPos] = useState(0);
  const [hits, setHits] = useState(0);
  const [flash, setFlash] = useState<"" | "hit" | "miss">("");
  const dir = useRef(1);
  const won = hits >= GOAL;
  const zone = Math.max(10, 22 - hits * 3);

  useEffect(() => {
    if (won) return;
    const speed = 0.9 + hits * 0.35;
    const t = setInterval(() => setPos((p) => {
      let n = p + dir.current * speed;
      if (n >= 100 || n <= 0) { dir.current *= -1; n = Math.max(0, Math.min(100, n)); }
      return n;
    }), 16);
    return () => clearInterval(t);
  }, [hits, won]);

  const stop = () => {
    if (won) return;
    if (Math.abs(pos - 50) <= zone / 2) {
      sfx.hit(); setFlash("hit");
      const n = hits + 1; setHits(n); if (n === GOAL) sfx.win();
    } else { sfx.miss(); setFlash("miss"); }
    setTimeout(() => setFlash(""), 300);
  };

  return (
    <div className="game-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-hand text-xl text-rose">mini-game</p>
          <h3 className="text-3xl font-semibold text-burgundy">Perfect Timing</h3>
        </div>
        <span className="text-sm">⏳ {hits}/{GOAL}</span>
      </div>
      <div className="mt-5 flex min-h-64 flex-col items-center justify-center gap-6 rounded-3xl bg-dawn p-5">
        <p className="text-center text-sm text-muted-foreground">Tap when the heart is inside the glow. It gets faster!</p>
        <div className={`relative h-16 w-full rounded-full bg-card transition ${flash === "hit" ? "ring-4 ring-gold" : flash === "miss" ? "ring-4 ring-destructive/60" : ""}`}>
          <div className="absolute top-0 h-full rounded-full bg-rose/30 shadow-glow" style={{ left: `${50 - zone / 2}%`, width: `${zone}%` }} />
          <Heart className="absolute top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 text-rose drop-shadow" style={{ left: `${pos}%` }} />
        </div>
        {won
          ? <button onClick={() => setHits(0)} className="rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">Play again</button>
          : <motion.button whileTap={{ scale: 0.9 }} onPointerDown={stop} className="pulseglow rounded-full bg-glow px-10 py-4 font-semibold tracking-widest text-primary-foreground">NOW!</motion.button>}
      </div>
      <AnimatePresence>
        {won && <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 rounded-2xl bg-secondary p-4 text-center font-display text-lg italic text-burgundy">🔓 {timingSecret}</motion.p>}
      </AnimatePresence>
    </div>
  );
}
