import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { starPoints, starSecret } from "@/content/story";
import { seeded, sfx } from "@/lib/sound";

export function StarConnect() {
  const [step, setStep] = useState(0);
  const [shake, setShake] = useState(false);
  const won = step === starPoints.length;
  const dust = useMemo(() => {
    const r = seeded(7);
    return Array.from({ length: 40 }, () => ({ x: r() * 100, y: r() * 100, s: 1 + r() * 2, d: r() * 3 }));
  }, []);

  const tap = (i: number) => {
    if (won) return;
    if (i === step) {
      sfx.pop();
      const n = step + 1;
      setStep(n);
      if (n === starPoints.length) setTimeout(() => sfx.win(), 200);
    } else if (i >= step) {
      sfx.wrong(); setShake(true); setTimeout(() => setShake(false), 300);
    }
  };

  const path = starPoints.slice(0, step).map(([x, y]) => `${x},${y}`).join(" ") + (won ? ` ${starPoints[0]![0]},${starPoints[0]![1]}` : "");

  return (
    <div className="game-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-hand text-xl text-rose">mini-game</p>
          <h3 className="text-3xl font-semibold text-burgundy">Connect Our Stars</h3>
        </div>
        <span className="text-sm">✨ {step}/{starPoints.length}</span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">Tap the glowing star, then follow the next one to draw our constellation.</p>
      <div className={`relative mt-4 aspect-[4/3] overflow-hidden rounded-3xl bg-night-sky ${shake ? "shake" : ""}`}>
        {dust.map((d, i) => (
          <span key={i} className="twinkle absolute rounded-full bg-starlight" style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.s, height: d.s, animationDelay: `${d.d}s` }} />
        ))}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full">
          <polyline points={path} fill={won ? "color-mix(in oklab, var(--rose) 35%, transparent)" : "none"} stroke="var(--gold)" strokeWidth="0.8" strokeLinejoin="round" vectorEffect="non-scaling-stroke" style={{ transition: "fill 1s", filter: "drop-shadow(0 0 3px var(--gold))" }} />
        </svg>
        {starPoints.map(([x, y], i) => {
          const lit = i < step;
          const next = i === step;
          return (
            <button key={i} onClick={() => tap(i)} aria-label={`star ${i + 1}`} className="absolute -translate-x-1/2 -translate-y-1/2 p-2" style={{ left: `${x}%`, top: `${y}%` }}>
              <motion.span
                animate={next ? { scale: [1, 1.5, 1] } : { scale: 1 }}
                transition={next ? { repeat: Infinity, duration: 1.2 } : {}}
                className={`block text-xl leading-none ${lit ? "text-gold" : next ? "text-starlight text-glow" : "text-starlight/40"}`}
              >★</motion.span>
            </button>
          );
        })}
        <AnimatePresence>
          {won && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-3xl text-starlight text-glow">A + R</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="mt-4 flex justify-center">
        <button onClick={() => { sfx.click(); setStep(0); }} className="rounded-full bg-primary px-6 py-2.5 font-semibold text-primary-foreground">{won ? "Draw it again" : "Restart"}</button>
      </div>
      <AnimatePresence>
        {won && (
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 rounded-2xl bg-secondary p-4 text-center font-display text-lg italic text-burgundy">
            🔓 {starSecret}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
