import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { letter } from "@/content/story";
import { Heart } from "./Ambient";
import { seeded, sfx } from "@/lib/sound";

export function Letter() {
  const [open, setOpen] = useState(false);
  const petals = useMemo(() => {
    const r = seeded(9);
    return Array.from({ length: 18 }, () => ({ x: r() * 100, d: r() * 4, t: 5 + r() * 4, r: r() * 360 }));
  }, []);

  return (
    <section id="letter" className="relative overflow-hidden px-5 py-24">
      <p className="text-center font-hand text-2xl text-rose">for your eyes only</p>
      <h2 className="text-center text-4xl font-semibold text-burgundy md:text-5xl">A Secret Letter</h2>

      {open && (
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {petals.map((p, i) => (
            <motion.span key={i} className="absolute top-0 h-3 w-2 rounded-[50%_0] bg-rose/70" style={{ left: `${p.x}%` }} initial={{ y: -20, rotate: p.r }} animate={{ y: "110vh", rotate: p.r + 360, x: [0, 30, -20, 10] }} transition={{ duration: p.t, delay: p.d, repeat: Infinity, ease: "linear" }} />
          ))}
        </div>
      )}

      <div className="relative mx-auto mt-12 max-w-xl">
        <AnimatePresence mode="wait">
          {!open ? (
            <motion.button key="env" onClick={() => { setOpen(true); sfx.win(); }} exit={{ y: 60, opacity: 0 }} whileHover={{ y: -6, rotate: -1 }} className="relative mx-auto block aspect-[3/2] w-full max-w-md" aria-label="Open the envelope">
              <div className="absolute inset-0 rounded-2xl bg-secondary shadow-glow" />
              <div className="absolute inset-x-0 top-0 h-1/2 origin-top rounded-t-2xl bg-rose" style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }} />
              <div className="absolute inset-x-0 bottom-0 h-3/5 rounded-b-2xl bg-secondary" style={{ clipPath: "polygon(0 100%, 50% 25%, 100% 100%)", filter: "brightness(.95)" }} />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"><Heart className="pulseglow h-12 w-12 rounded-full text-burgundy" /></div>
              <p className="absolute -bottom-10 w-full text-center font-hand text-xl text-muted-foreground">tap to open</p>
            </motion.button>
          ) : (
            <motion.article key="paper" initial={{ y: 80, opacity: 0, scale: 0.9 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ duration: 0.9 }} className="grain relative rounded-xl bg-card p-7 font-hand text-2xl leading-snug text-foreground shadow-glow md:p-12 md:text-[1.7rem]" style={{ backgroundImage: "repeating-linear-gradient(transparent 0 2.1rem, var(--border) 2.1rem calc(2.1rem + 1px))" }}>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-burgundy">{letter.greeting}</motion.p>
              {letter.paragraphs.map((p, i) => (
                <motion.p key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 + i * 1.1, duration: 0.8 }} className="mt-4">{p}</motion.p>
              ))}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 + letter.paragraphs.length * 1.1 }} className="mt-6 text-right text-burgundy">
                <p>{letter.signoff}</p>
                <p className="text-3xl">{letter.name}</p>
              </motion.div>
              <button onClick={() => setOpen(false)} className="mt-6 font-sans text-xs text-muted-foreground underline">fold it back</button>
            </motion.article>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
