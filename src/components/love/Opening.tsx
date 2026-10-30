import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Character, type Pose } from "./Character";
import { FloatingHearts, Heart, Stars } from "./Ambient";
import { couple } from "@/content/story";
import { sfx } from "@/lib/sound";

export function Opening({ onStart }: { onStart: () => void }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t = [setTimeout(() => setPhase(1), 3200), setTimeout(() => setPhase(2), 4800), setTimeout(() => setPhase(3), 6400)];
    return () => t.forEach(clearTimeout);
  }, []);
  const adi: Pose = phase === 0 ? "walk" : phase === 1 ? "wave" : phase === 2 ? "shy" : "hold";
  const ritu: Pose = phase === 0 ? "walk" : phase === 1 ? "laugh" : phase === 2 ? "shy" : "hold";

  return (
    <section className="grain relative flex min-h-[100svh] flex-col items-center justify-between overflow-hidden bg-night-sky px-4 pb-10 pt-20 text-starlight">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 3 }} className="absolute inset-0">
        <Stars count={120} seed={42} />
      </motion.div>
      <motion.div className="absolute right-[6%] top-[4%] h-12 w-12 md:right-[12%] md:top-[12%] rounded-full bg-starlight shadow-glow md:h-28 md:w-28" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 0.9, y: 0 }} transition={{ duration: 3 }} />
      {phase >= 2 && <FloatingHearts count={16} />}

      <div className="relative z-10 text-center">
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 1.5 }} className="font-hand text-2xl text-rose md:text-3xl">
          Somewhere between a hello and forever…
        </motion.p>
        {phase >= 2 && (
          <>
            <motion.h1 initial={{ opacity: 0, letterSpacing: "0.6em" }} animate={{ opacity: 1, letterSpacing: "0.12em" }} transition={{ duration: 2 }} className="text-glow mt-4 text-5xl font-semibold md:text-8xl">
              {couple.title}
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-3 text-starlight/75 md:text-lg">
              Two stubborn souls. One unexpected love story.
            </motion.p>
          </>
        )}
      </div>

      <div className="relative z-10 flex w-full max-w-3xl items-end justify-center" style={{ height: 260 }}>
        <motion.div initial={{ x: "-60vw" }} animate={{ x: phase >= 3 ? 18 : 0 }} transition={{ duration: phase === 0 ? 3.2 : 1.2, ease: "easeOut" }}>
          <Character who="aditya" pose={adi} size={120} />
        </motion.div>
        <motion.div className="mx-2 mb-40" animate={{ scale: phase >= 2 ? [1, 1.3, 1] : 0 }} transition={{ repeat: Infinity, duration: 1.2 }}>
          <Heart className="h-8 w-8 text-rose" />
        </motion.div>
        <motion.div initial={{ x: "60vw" }} animate={{ x: phase >= 3 ? -18 : 0 }} transition={{ duration: phase === 0 ? 3.2 : 1.2, ease: "easeOut" }}>
          <Character who="ritu" pose={ritu} flip size={120} />
        </motion.div>
      </div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: phase >= 3 ? 1 : 0, y: phase >= 3 ? 0 : 20 }}
        onClick={() => { sfx.click(); onStart(); }}
        disabled={phase < 3}
        className="pulseglow relative z-10 rounded-full bg-glow px-8 py-4 font-semibold tracking-[0.2em] text-night"
      >
        START OUR MOVIE
      </motion.button>
    </section>
  );
}
