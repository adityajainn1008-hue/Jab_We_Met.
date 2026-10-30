import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "./Ambient";
import { Character } from "./Character";
import { catchSecret } from "@/content/story";
import { sfx } from "@/lib/sound";

const GOAL = 5;
const TIME = 30;
const KEY = "jwm-catch-best";

interface H { id: number; x: number; y: number; dx: number; dy: number; dur: number; size: number }

export function CatchHearts() {
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [left, setLeft] = useState(TIME);
  const [hearts, setHearts] = useState<H[]>([]);
  const [unlocked, setUnlocked] = useState(false);
  const [best, setBest] = useState(0);
  const id = useRef(0);
  const scoreRef = useRef(0);

  useEffect(() => {
    setBest(Number(localStorage.getItem(KEY) || 0));
    if (localStorage.getItem("jwm-catch-unlocked")) setUnlocked(true);
  }, []);

  useEffect(() => {
    if (!running) return;
    const tick = setInterval(() => setLeft((l) => (l <= 1 ? 0 : l - 1)), 1000);
    let spawnT: ReturnType<typeof setTimeout>;
    const spawn = () => {
      const lvl = scoreRef.current;
      const dur = Math.max(1.4, 3.6 - lvl * 0.25);
      const h: H = { id: ++id.current, x: 5 + Math.random() * 80, y: 10 + Math.random() * 70, dx: (Math.random() - 0.5) * 60, dy: -30 - Math.random() * 60, dur, size: Math.max(34, 60 - lvl * 3) };
      setHearts((hs) => [...hs, h]);
      setTimeout(() => setHearts((hs) => hs.filter((x) => x.id !== h.id)), dur * 1000);
      spawnT = setTimeout(spawn, Math.max(350, 900 - lvl * 60));
    };
    spawn();
    return () => { clearInterval(tick); clearTimeout(spawnT); };
  }, [running]);

  useEffect(() => {
    if (running && left === 0) {
      setRunning(false);
      setHearts([]);
      if (score > best) { setBest(score); localStorage.setItem(KEY, String(score)); }
    }
  }, [left, running, score, best]);

  const start = () => { sfx.click(); setScore(0); scoreRef.current = 0; setLeft(TIME); setHearts([]); setRunning(true); };

  const tap = (h: H) => {
    sfx.pop();
    setHearts((hs) => hs.filter((x) => x.id !== h.id));
    setScore((s) => {
      const n = s + 1;
      scoreRef.current = n;
      if (n === GOAL) { sfx.win(); setUnlocked(true); localStorage.setItem("jwm-catch-unlocked", "1"); }
      return n;
    });
  };

  return (
    <div className="game-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-hand text-xl text-rose">mini-game</p>
          <h3 className="text-3xl font-semibold text-burgundy">Catch My Heart</h3>
        </div>
        <div className="flex gap-4 text-sm">
          <span>❤ {score}/{GOAL}</span><span>⏱ {left}s</span><span className="text-muted-foreground">best {best}</span>
        </div>
      </div>
      <div className="relative mt-5 h-80 touch-none select-none overflow-hidden rounded-3xl bg-dawn">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2"><Character who="ritu" pose={running ? "laugh" : unlocked ? "shy" : "wave"} size={70} /></div>
        {hearts.map((h) => (
          <motion.button
            key={h.id}
            aria-label="heart"
            onPointerDown={() => tap(h)}
            className="absolute"
            style={{ left: `${h.x}%`, top: `${h.y}%` }}
            initial={{ scale: 0, x: 0, y: 0 }}
            animate={{ scale: [0, 1, 1, 0.6], x: h.dx, y: h.dy, opacity: [1, 1, 1, 0] }}
            transition={{ duration: h.dur, ease: "linear" }}
          >
            <Heart className="text-rose drop-shadow" style={{ width: h.size, height: h.size }} />
          </motion.button>
        ))}
        {!running && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-card/40 p-6 text-center backdrop-blur-[2px]">
            {left === 0 && <p className="font-display text-xl text-burgundy">You caught {score} {score === 1 ? "heart" : "hearts"}!</p>}
            <button onClick={start} className="rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">
              {left === 0 ? "Play again" : "Start — catch 5 hearts"}
            </button>
          </div>
        )}
      </div>
      <AnimatePresence>
        {unlocked && (
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 rounded-2xl bg-secondary p-4 text-center font-display text-lg italic text-burgundy">
            🔓 {catchSecret}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
