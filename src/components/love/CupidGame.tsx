import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Stars } from "./Ambient";
import { Character } from "./Character";
import { sfx } from "@/lib/sound";
import { cupidWin } from "@/content/story";

const NEED = 3;
const HEART = 64;

interface Arrow { id: number; x0: number; y0: number; x1: number; y1: number; angle: number }
interface Burst { id: number; x: number; y: number; label: string }

function Cupid() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible" aria-label="Cupid">
      <g style={{ animation: "bob 1.6s ease-in-out infinite" }}>
        <path d="M30 45 Q10 25 18 52 Q22 60 34 55Z" fill="var(--starlight)" opacity=".9" />
        <path d="M70 45 Q90 25 82 52 Q78 60 66 55Z" fill="var(--starlight)" opacity=".9" />
        <circle cx="50" cy="62" r="17" fill="var(--skin)" />
        <circle cx="50" cy="36" r="16" fill="var(--skin)" />
        <path d="M35 32 Q38 16 50 18 Q64 16 66 32 Q58 24 50 26 Q42 24 35 32Z" fill="var(--gold)" />
        <ellipse cx="50" cy="16" rx="11" ry="3" fill="none" stroke="var(--gold)" strokeWidth="2" />
        <ellipse className="eye" cx="44" cy="37" rx="2.3" ry="3" fill="var(--ink)" style={{ animation: "blink 3s infinite", transformBox: "fill-box", transformOrigin: "center" }} />
        <ellipse className="eye" cx="56" cy="37" rx="2.3" ry="3" fill="var(--ink)" style={{ animation: "blink 3s infinite", transformBox: "fill-box", transformOrigin: "center" }} />
        <path d="M45 43 Q50 47 55 43" stroke="var(--ink)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <ellipse cx="40" cy="42" rx="3" ry="2" fill="var(--blush)" />
        <ellipse cx="60" cy="42" rx="3" ry="2" fill="var(--blush)" />
        <path d="M66 46 Q84 62 66 80" stroke="var(--burgundy)" strokeWidth="3" fill="none" />
        <line x1="66" y1="46" x2="66" y2="80" stroke="var(--starlight)" strokeWidth="1" />
        <path d="M38 76 Q50 86 62 76 L60 70 L40 70Z" fill="var(--starlight)" />
      </g>
    </svg>
  );
}

export function CupidGame({ onUnlock, canSkip }: { onUnlock: () => void; canSkip: boolean }) {
  const arena = useRef<HTMLDivElement>(null);
  const heartEl = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 200, y: 120, vx: 2.2, vy: 1.6 });
  const [score, setScore] = useState(0);
  const [arrows, setArrows] = useState<Arrow[]>([]);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [won, setWon] = useState(false);
  const [miss, setMiss] = useState(0);
  const idRef = useRef(0);
  const [aim, setAim] = useState<{ x: number; y: number } | null>(null);
  const trail = useRef<HTMLDivElement[]>([]);
  const hist = useRef<{ x: number; y: number }[]>([]);

  const teleport = useCallback(() => {
    const a = arena.current;
    if (!a) return;
    const w = a.clientWidth, h = a.clientHeight;
    const p = pos.current;
    p.x = 40 + Math.random() * (w - HEART - 80);
    p.y = 30 + Math.random() * (h * 0.6 - HEART);
    const sp = 1.8 + Math.random() * 2.2 + score * 0.6;
    const ang = Math.random() * Math.PI * 2;
    p.vx = Math.cos(ang) * sp;
    p.vy = Math.sin(ang) * sp;
  }, [score]);

  useEffect(() => {
    teleport();
    let raf = 0;
    let last = performance.now();
    let nextTurn = last + 900;
    const loop = (t: number) => {
      const a = arena.current, el = heartEl.current;
      const dt = Math.min(2, (t - last) / 16.7);
      last = t;
      if (a && el && !won) {
        const p = pos.current;
        const w = a.clientWidth, h = a.clientHeight * 0.72;
        if (t > nextTurn) {
          const sp = Math.hypot(p.vx, p.vy) * (0.75 + Math.random() * 0.6);
          const ang = Math.atan2(p.vy, p.vx) + (Math.random() - 0.5) * 2.4;
          const clamped = Math.max(1.4, Math.min(5.5, sp));
          p.vx = Math.cos(ang) * clamped;
          p.vy = Math.sin(ang) * clamped;
          nextTurn = t + 500 + Math.random() * 1200;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.x < 0 || p.x > w - HEART) { p.vx *= -1; p.x = Math.max(0, Math.min(w - HEART, p.x)); }
        if (p.y < 0 || p.y > h - HEART) { p.vy *= -1; p.y = Math.max(0, Math.min(h - HEART, p.y)); }
        el.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.vx * 3}deg)`;
        hist.current.unshift({ x: p.x, y: p.y });
        hist.current.length = Math.min(hist.current.length, 24);
        trail.current.forEach((d, i) => {
          const hp = hist.current[(i + 1) * 4];
          if (d && hp) d.style.transform = `translate(${hp.x + HEART / 2 - 6}px, ${hp.y + HEART / 2 - 6}px) scale(${1 - i * 0.18})`;
        });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [won]);

  const fire = (e: React.PointerEvent) => {
    if (won || !arena.current) return;
    const r = arena.current.getBoundingClientRect();
    const x1 = e.clientX - r.left, y1 = e.clientY - r.top;
    const x0 = 70, y0 = r.height - 70;
    const angle = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI;
    sfx.shoot();
    setArrows((a) => [...a, { id: ++idRef.current, x0, y0, x1, y1, angle }]);
  };

  const land = (ar: Arrow) => {
    setArrows((a) => a.filter((x) => x.id !== ar.id));
    const p = pos.current;
    const cx = p.x + HEART / 2, cy = p.y + HEART / 2;
    if (Math.hypot(ar.x1 - cx, ar.y1 - cy) < HEART * 0.75) {
      sfx.hit();
      const labels = ["Bullseye!", "Dil pe laga!", "Perfect!", "Cupid approves!"];
      setBursts((b) => [...b, { id: ar.id, x: cx, y: cy, label: labels[Math.floor(Math.random() * labels.length)]! }]);
      arena.current?.animate([{ transform: "translate(0,0)" }, { transform: "translate(-6px,4px)" }, { transform: "translate(5px,-3px)" }, { transform: "translate(0,0)" }], { duration: 280 });
      setTimeout(() => setBursts((b) => b.filter((x) => x.id !== ar.id)), 900);
      setScore((s) => {
        const n = s + 1;
        if (n >= NEED) {
          setWon(true);
          setTimeout(() => sfx.win(), 200);
        }
        return n;
      });
      teleport();
    } else {
      sfx.miss();
      setMiss((m) => m + 1);
    }
  };

  const restart = () => {
    setScore(0); setMiss(0); setWon(false); setArrows([]); teleport(); sfx.click();
  };

  return (
    <section className="grain relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-night-sky px-4 py-16 text-starlight">
      <Stars count={90} seed={11} />
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 mb-4 text-center">
        <p className="font-hand text-2xl text-rose">before the movie begins…</p>
        <h1 className="text-3xl font-semibold md:text-5xl">Cupid's Moving Heart</h1>
        <p className="mt-2 text-sm text-starlight/70">Tap where the heart is going. Hit it {NEED} times.</p>
      </motion.div>

      <div className="relative z-10 mb-3 flex items-center gap-4">
        <div className="flex gap-1.5" aria-label={`Score ${score} of ${NEED}`}>
          {Array.from({ length: NEED }).map((_, i) => (
            <Heart key={i} className={`h-6 w-6 transition-all ${i < score ? "scale-110 text-rose" : "text-starlight/20"}`} />
          ))}
        </div>
        <span className="text-xs text-starlight/60">misses: {miss}</span>
        <button onClick={restart} className="rounded-full border border-starlight/30 px-3 py-1 text-xs hover:bg-starlight/10">
          Restart
        </button>
      </div>

      <div
        ref={arena}
        onPointerDown={fire}
        onPointerMove={(e) => { const r = arena.current!.getBoundingClientRect(); setAim({ x: e.clientX - r.left, y: e.clientY - r.top }); }}
        onPointerLeave={() => setAim(null)}
        className="relative z-10 h-[62svh] w-full max-w-3xl cursor-crosshair touch-none select-none overflow-hidden rounded-3xl border border-rose/30 bg-night/40 shadow-glow"
      >
        <div className="aurora pointer-events-none absolute -inset-x-20 top-0 h-1/2 bg-gradient-to-b from-rose/30 via-gold/10 to-transparent blur-2xl" />
        <Stars count={30} seed={23} />
        {[18, 46, 70].map((t, i) => (
          <div key={i} className="drift pointer-events-none absolute h-8 w-28 rounded-full bg-starlight/10 blur-md" style={{ top: `${t}%`, animationDelay: `${-i * 13}s`, animationDuration: `${34 + i * 8}s` }} />
        ))}
        <div className="pointer-events-none absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-night-2 to-transparent" />
        <div className="pointer-events-none absolute bottom-1 right-2 flex items-end">
          <Character who="aditya" pose={won ? "hold" : score > 0 ? "laugh" : "idle"} size={44} />
          <Character who="ritu" pose={won ? "hold" : score > 0 ? "shy" : "idle"} flip size={44} />
        </div>
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} ref={(d) => { if (d) trail.current[i] = d; }} className="pointer-events-none absolute left-0 top-0 h-3 w-3 rounded-full bg-rose/50 blur-[1px]" style={{ opacity: won ? 0 : 0.7 - i * 0.13 }} />
        ))}
        {aim && !won && (
          <svg className="pointer-events-none absolute inset-0 h-full w-full">
            <line x1="70" y1={(arena.current?.clientHeight ?? 0) - 70} x2={aim.x} y2={aim.y} stroke="var(--gold)" strokeOpacity=".45" strokeWidth="1.5" strokeDasharray="4 6" />
            <circle cx={aim.x} cy={aim.y} r="14" fill="none" stroke="var(--rose)" strokeWidth="1.5" />
            <circle cx={aim.x} cy={aim.y} r="2" fill="var(--rose)" />
          </svg>
        )}
        <div ref={heartEl} className="absolute left-0 top-0" style={{ width: HEART, height: HEART }}>
          {!won && (
            <div className="relative h-full w-full">
              <div className="absolute inset-0 rounded-full bg-rose/40 blur-xl" />
              <svg viewBox="0 0 40 24" className="flap-l absolute -left-7 top-2 w-9" aria-hidden><path d="M40 12 Q20 -6 2 6 Q14 8 8 16 Q22 12 18 22 Q30 14 40 12Z" fill="var(--starlight)" opacity=".9" /></svg>
              <div className="absolute -right-7 top-2 w-9" style={{ transform: "scaleX(-1)" }}><svg viewBox="0 0 40 24" className="flap-l w-9" aria-hidden><path d="M40 12 Q20 -6 2 6 Q14 8 8 16 Q22 12 18 22 Q30 14 40 12Z" fill="var(--starlight)" opacity=".9" /></svg></div>
              <Heart className="relative h-full w-full text-rose drop-shadow-lg" style={{ animation: "bob .8s ease-in-out infinite" }} />
            </div>
          )}
        </div>
        <div className="pointer-events-none absolute bottom-2 left-2 h-28 w-28">
          <Cupid />
        </div>
        {arrows.map((a) => (
          <motion.div
            key={a.id}
            className="pointer-events-none absolute left-0 top-0"
            initial={{ x: a.x0, y: a.y0, rotate: a.angle }}
            animate={{ x: a.x1, y: a.y1 }}
            transition={{ duration: 0.32, ease: "easeIn" }}
            onAnimationComplete={() => land(a)}
          >
            <svg width="54" height="12" viewBox="0 0 54 12" style={{ marginLeft: -54, marginTop: -6 }}>
              <line x1="4" y1="6" x2="46" y2="6" stroke="var(--gold)" strokeWidth="2" />
              <path d="M46 1 L54 6 L46 11Z" fill="var(--rose)" />
              <path d="M0 2 L8 6 L0 10 M5 2 L13 6 L5 10" stroke="var(--rose)" strokeWidth="1.5" fill="none" />
            </svg>
          </motion.div>
        ))}
        {bursts.map((b) => (
          <div key={b.id} className="pointer-events-none absolute" style={{ left: b.x, top: b.y }}>
            <motion.span className="absolute -translate-x-1/2 whitespace-nowrap font-hand text-2xl text-gold" initial={{ y: -20, opacity: 0, scale: 0.6 }} animate={{ y: -70, opacity: [0, 1, 0], scale: 1.1 }} transition={{ duration: 0.9 }}>{b.label}</motion.span>
            <motion.span className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-rose" initial={{ scale: 0, opacity: 1 }} animate={{ scale: 8, opacity: 0 }} transition={{ duration: 0.6 }} />
            {Array.from({ length: 10 }).map((_, i) => {
              const ang = (i / 10) * Math.PI * 2;
              return (
                <motion.div key={i} className="absolute" initial={{ x: 0, y: 0, opacity: 1, scale: 1 }} animate={{ x: Math.cos(ang) * 70, y: Math.sin(ang) * 70, opacity: 0, scale: 0.4 }} transition={{ duration: 0.8 }}>
                  <Heart className="h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-rose" />
                </motion.div>
              );
            })}
          </div>
        ))}

        <AnimatePresence>
          {won && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex flex-col items-center justify-center bg-night/70 p-6 text-center backdrop-blur-sm">
              {Array.from({ length: 24 }).map((_, i) => {
                const ang = (i / 24) * Math.PI * 2;
                return (
                  <motion.div key={i} className="absolute left-1/2 top-1/2" initial={{ x: 0, y: 0, scale: 0 }} animate={{ x: Math.cos(ang) * 260, y: Math.sin(ang) * 220, scale: [0, 1.4, 0.6], opacity: [1, 1, 0] }} transition={{ duration: 1.6, ease: "easeOut" }}>
                    <Heart className="h-6 w-6 text-rose" />
                  </motion.div>
                );
              })}
              <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="max-w-md font-display text-xl italic md:text-2xl">
                {cupidWin}
              </motion.p>
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.4 }}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => { sfx.click(); onUnlock(); }}
                className="pulseglow mt-8 rounded-full bg-glow px-7 py-3 font-semibold tracking-wide text-night"
              >
                UNLOCK OUR LOVE STORY →
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {canSkip && !won && (
        <button onClick={onUnlock} className="relative z-10 mt-4 text-xs text-starlight/50 underline underline-offset-4">
          Already won before — skip to the movie
        </button>
      )}
    </section>
  );
}
