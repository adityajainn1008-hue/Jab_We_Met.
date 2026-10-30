import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "./Ambient";
import { Character } from "./Character";
import { popNotes } from "@/content/story";
import { sfx } from "@/lib/sound";

const KEY = "jwm-pop-found";

/** A surprise heart randomly pops up while she scrolls. Catch it to read a little note. */
export function PopHearts() {
  const [spot, setSpot] = useState<{ x: number; y: number; id: number } | null>(null);
  const [found, setFound] = useState(0);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    setFound(Number(localStorage.getItem(KEY) || 0));
  }, []);

  useEffect(() => {
    let hide: ReturnType<typeof setTimeout>;
    let next: ReturnType<typeof setTimeout>;
    const schedule = () => {
      next = setTimeout(() => {
        setSpot({ x: 8 + Math.random() * 78, y: 15 + Math.random() * 65, id: Date.now() });
        sfx.pop();
        hide = setTimeout(() => setSpot(null), 3800);
        schedule();
      }, 9000 + Math.random() * 9000);
    };
    schedule();
    return () => { clearTimeout(hide); clearTimeout(next); };
  }, []);

  const catchIt = () => {
    sfx.hit();
    setSpot(null);
    const n = found + 1;
    setFound(n);
    localStorage.setItem(KEY, String(n));
    setNote(popNotes[(n - 1) % popNotes.length] ?? null);
    setTimeout(() => setNote(null), 4200);
  };

  return (
    <>
      <div className="fixed bottom-3 left-3 z-40 flex items-center gap-1.5 rounded-full bg-night/80 px-3 py-1.5 text-xs text-starlight backdrop-blur">
        <Heart className="h-3.5 w-3.5 text-rose" /> surprise hearts caught: {found}
      </div>
      <AnimatePresence>
        {spot && (
          <motion.button
            key={spot.id}
            aria-label="Catch the surprise heart"
            onClick={catchIt}
            className="fixed z-40 p-2"
            style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: [0, 1.3, 1], rotate: 0, y: [0, -8, 0] }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-0 rounded-full bg-rose/40 blur-lg" />
            <Heart className="pulseglow relative h-12 w-12 rounded-full text-rose" />
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {note && (
          <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }} className="fixed bottom-14 left-1/2 z-50 flex -translate-x-1/2 items-end gap-2 rounded-3xl bg-card px-4 py-3 shadow-glow">
            <Character who="aditya" pose="wave" size={40} />
            <p className="max-w-[220px] pb-2 font-hand text-xl text-burgundy">{note}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
