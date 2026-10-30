import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "./Ambient";
import { popupLines } from "@/content/story";
import { sfx } from "@/lib/sound";

type Kind = "tap" | "pick" | "hold";
const NEED = 3;

export function SurprisePopup() {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<Kind>("tap");
  const [line, setLine] = useState("");
  const [won, setWon] = useState(false);
  const [taps, setTaps] = useState(0);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [hold, setHold] = useState(0);
  const [cards, setCards] = useState<string[]>([]);
  const holdT = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => {
      const ks: Kind[] = ["tap", "pick", "hold"];
      setKind(ks[Math.floor(Math.random() * ks.length)]!);
      setLine(popupLines[Math.floor(Math.random() * popupLines.length)]!);
      setWon(false); setTaps(0); setHold(0); setPos({ x: 50, y: 50 });
      setCards(["💔", "💔", "❤️", "💔"].sort(() => Math.random() - 0.5));
      setOpen(true); sfx.pop();
    }, 25000 + Math.random() * 25000);
    return () => clearTimeout(t);
  }, [open]);

  const win = () => { sfx.win(); setWon(true); };
  const tap = () => {
    sfx.hit();
    const n = taps + 1; setTaps(n);
    if (n >= NEED) win(); else setPos({ x: 15 + Math.random() * 70, y: 15 + Math.random() * 70 });
  };
  const startHold = () => {
    holdT.current = setInterval(() => setHold((h) => { const n = h + 5; if (n >= 100) { clearInterval(holdT.current); win(); } return Math.min(n, 100); }), 60);
  };
  const endHold = () => { clearInterval(holdT.current); setHold((h) => (h >= 100 ? h : 0)); };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center bg-night/60 p-4 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.7, rotate: -4 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0.7 }} className="game-card relative w-full max-w-sm text-center">
            <button onClick={() => setOpen(false)} aria-label="close" className="absolute right-4 top-3 text-xl text-muted-foreground">×</button>
            <p className="font-hand text-xl text-rose">surprise!</p>
            {!won ? (
              <>
                <h3 className="text-2xl font-semibold text-burgundy">
                  {kind === "tap" ? `Catch the heart ${NEED} times` : kind === "pick" ? "Find the whole heart" : "Hold the heart to fill it"}
                </h3>
                <div className="relative mt-4 h-52 select-none overflow-hidden rounded-3xl bg-dawn">
                  {kind === "tap" && (
                    <motion.button animate={{ left: `${pos.x}%`, top: `${pos.y}%` }} onPointerDown={tap} className="absolute -translate-x-1/2 -translate-y-1/2" aria-label="heart">
                      <Heart className="animate-pulse h-12 w-12 text-rose" />
                    </motion.button>
                  )}
                  {kind === "pick" && (
                    <div className="grid h-full grid-cols-2 gap-3 p-4">
                      {cards.map((c, i) => (
                        <button key={i} onClick={() => (c === "❤️" ? win() : sfx.wrong())} className="rounded-2xl bg-glow text-2xl text-primary-foreground">?</button>
                      ))}
                    </div>
                  )}
                  {kind === "hold" && (
                    <div className="flex h-full flex-col items-center justify-center gap-3">
                      <button onPointerDown={startHold} onPointerUp={endHold} onPointerLeave={endHold} className="touch-none" aria-label="hold heart">
                        <Heart className="h-24 w-24 text-rose" style={{ opacity: 0.3 + hold / 140, transform: `scale(${0.8 + hold / 400})` }} />
                      </button>
                      <div className="h-2 w-40 overflow-hidden rounded-full bg-card"><div className="h-full bg-rose" style={{ width: `${hold}%` }} /></div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Heart className="mx-auto mt-2 h-14 w-14 text-rose" />
                <p className="mt-3 font-display text-xl italic leading-relaxed text-burgundy">{line}</p>
                <button onClick={() => setOpen(false)} className="mt-5 rounded-full bg-primary px-6 py-2.5 font-semibold text-primary-foreground">Aww, close ❤</button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
