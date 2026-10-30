import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { memoryCards, memorySecret } from "@/content/story";
import { sfx } from "@/lib/sound";

interface C { id: number; v: string }
const shuffle = (): C[] =>
  [...memoryCards, ...memoryCards].map((v, id) => ({ id, v })).sort(() => Math.random() - 0.5);

export function MemoryMatch() {
  const [cards, setCards] = useState<C[]>([]);
  const [open, setOpen] = useState<number[]>([]);
  const [done, setDone] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [best, setBest] = useState(0);
  const won = cards.length > 0 && done.length === cards.length;

  useEffect(() => { setCards(shuffle()); setBest(Number(localStorage.getItem("jwm-mem-best") || 0)); }, []);

  useEffect(() => {
    if (!won) return;
    sfx.win();
    if (!best || moves < best) { setBest(moves); localStorage.setItem("jwm-mem-best", String(moves)); }
  }, [won]); // eslint-disable-line react-hooks/exhaustive-deps

  const flip = (i: number) => {
    if (open.length === 2 || open.includes(i) || done.includes(i)) return;
    sfx.click();
    const next = [...open, i];
    setOpen(next);
    if (next.length === 2) {
      setMoves((m) => m + 1);
      const a = next[0]!, b = next[1]!;
      if (cards[a]?.v === cards[b]?.v) {
        setTimeout(() => { sfx.hit(); setDone((d) => [...d, a, b]); setOpen([]); }, 350);
      } else {
        setTimeout(() => { sfx.miss(); setOpen([]); }, 800);
      }
    }
  };

  const reset = () => { sfx.click(); setCards(shuffle()); setOpen([]); setDone([]); setMoves(0); };

  return (
    <div className="game-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-hand text-xl text-rose">mini-game</p>
          <h3 className="text-3xl font-semibold text-burgundy">Memory Match</h3>
        </div>
        <div className="flex gap-4 text-sm">
          <span>🔁 {moves} moves</span><span className="text-muted-foreground">best {best || "—"}</span>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-4 gap-2 rounded-3xl bg-dawn p-3 sm:gap-3 sm:p-4">
        {cards.map((c, i) => {
          const up = open.includes(i) || done.includes(i);
          return (
            <button key={c.id} onClick={() => flip(i)} aria-label={up ? c.v : "hidden card"} className="aspect-square [perspective:600px]">
              <motion.div animate={{ rotateY: up ? 180 : 0 }} transition={{ duration: 0.4 }} className="relative h-full w-full [transform-style:preserve-3d]">
                <span className="absolute inset-0 flex items-center justify-center rounded-2xl bg-glow text-2xl text-primary-foreground shadow-glow [backface-visibility:hidden]">❤</span>
                <span className={`absolute inset-0 flex items-center justify-center rounded-2xl bg-card text-3xl [backface-visibility:hidden] [transform:rotateY(180deg)] ${done.includes(i) ? "ring-2 ring-gold" : ""}`}>{c.v}</span>
              </motion.div>
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex justify-center">
        <button onClick={reset} className="rounded-full bg-primary px-6 py-2.5 font-semibold text-primary-foreground">Shuffle again</button>
      </div>
      <AnimatePresence>
        {won && (
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 rounded-2xl bg-secondary p-4 text-center font-display text-lg italic text-burgundy">
            🔓 {memorySecret}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
