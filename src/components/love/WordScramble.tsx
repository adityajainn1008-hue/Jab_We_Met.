import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { scrambleSecret, scrambleWords } from "@/content/story";
import { sfx } from "@/lib/sound";

const mix = (w: string) => {
  let a = w.split("").map((ch, i) => ({ ch, i }));
  do a = [...a].sort(() => Math.random() - 0.5); while (a.map((x) => x.ch).join("") === w);
  return a;
};

export function WordScramble() {
  const [lvl, setLvl] = useState(0);
  const [pool, setPool] = useState<{ ch: string; i: number }[]>([]);
  const [picked, setPicked] = useState<{ ch: string; i: number }[]>([]);
  const [shake, setShake] = useState(false);
  const done = lvl >= scrambleWords.length;
  const word = scrambleWords[lvl] ?? "";

  useEffect(() => { if (word) { setPool(mix(word)); setPicked([]); } }, [word]);

  const pick = (t: { ch: string; i: number }) => {
    sfx.click();
    const next = [...picked, t];
    setPicked(next);
    setPool((p) => p.filter((x) => x !== t));
    if (next.length === word.length) {
      if (next.map((x) => x.ch).join("") === word) {
        sfx.hit();
        setTimeout(() => { if (lvl + 1 === scrambleWords.length) sfx.win(); setLvl((l) => l + 1); }, 500);
      } else {
        sfx.wrong(); setShake(true);
        setTimeout(() => { setShake(false); setPool(mix(word)); setPicked([]); }, 600);
      }
    }
  };

  return (
    <div className="game-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-hand text-xl text-rose">mini-game</p>
          <h3 className="text-3xl font-semibold text-burgundy">Love Word Jumble</h3>
        </div>
        <span className="text-sm">💌 {Math.min(lvl, scrambleWords.length)}/{scrambleWords.length}</span>
      </div>
      <div className="mt-5 flex min-h-64 flex-col items-center justify-center gap-6 rounded-3xl bg-dawn p-5">
        {!done ? (
          <>
            <motion.div animate={shake ? { x: [0, -10, 10, -6, 6, 0] } : {}} className="flex min-h-14 flex-wrap justify-center gap-2">
              {Array.from({ length: word.length }, (_, k) => (
                <span key={k} className="flex h-12 w-10 items-center justify-center rounded-xl border-2 border-rose/40 bg-card font-display text-2xl text-burgundy">{picked[k]?.ch ?? ""}</span>
              ))}
            </motion.div>
            <div className="flex flex-wrap justify-center gap-2">
              {pool.map((t) => (
                <motion.button key={t.i} layout whileTap={{ scale: 0.85 }} onClick={() => pick(t)} className="h-12 w-10 rounded-xl bg-glow font-display text-2xl text-primary-foreground shadow-glow">{t.ch}</motion.button>
              ))}
            </div>
            <button onClick={() => { setPool(mix(word)); setPicked([]); }} className="text-sm text-muted-foreground underline">reset letters</button>
          </>
        ) : (
          <button onClick={() => setLvl(0)} className="rounded-full bg-primary px-6 py-2.5 font-semibold text-primary-foreground">Play again</button>
        )}
      </div>
      <AnimatePresence>
        {done && (
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 rounded-2xl bg-secondary p-4 text-center font-display text-lg italic text-burgundy">🔓 {scrambleSecret}</motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
