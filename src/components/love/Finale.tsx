import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Character } from "./Character";
import { FloatingHearts, Stars } from "./Ambient";
import { couple } from "@/content/story";

export function Finale({ onReplay }: { onReplay: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { amount: 0.5, once: true });
  return (
    <section id="finale" ref={ref} className="grain relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-night-sky px-5 py-24 text-center text-starlight">
      <motion.div className="absolute inset-0" initial={{ scale: 1.4 }} animate={seen ? { scale: 1 } : {}} transition={{ duration: 5, ease: "easeOut" }}>
        <Stars count={180} seed={77} />
        <div className="absolute left-1/2 top-[14%] h-24 w-24 -translate-x-1/2 rounded-full bg-starlight shadow-glow md:h-32 md:w-32" style={{ boxShadow: "0 0 90px 20px color-mix(in oklab, var(--starlight) 40%, transparent)" }} />
      </motion.div>
      {seen && <FloatingHearts count={22} seed={8} />}
      <motion.div className="relative z-10 mt-32 flex items-end" initial={{ scale: 1.3 }} animate={seen ? { scale: 0.85 } : {}} transition={{ duration: 5, ease: "easeOut" }}>
        <motion.div initial={{ x: -40 }} animate={seen ? { x: 6 } : {}} transition={{ duration: 2.5, delay: 0.5 }}>
          <Character who="aditya" pose={seen ? "hold" : "idle"} size={110} />
        </motion.div>
        <motion.div initial={{ x: 40 }} animate={seen ? { x: -6 } : {}} transition={{ duration: 2.5, delay: 0.5 }}>
          <Character who="ritu" pose={seen ? "hold" : "idle"} flip size={110} />
        </motion.div>
      </motion.div>
      <div className="relative z-10 mt-10 space-y-3">
        {["Different cities. Different worlds. One love story.", `Happy Anniversary, ${couple.her}.`, "Here's to every version of us. To forever. <3"].map((t, i) => (
          <motion.p key={i} initial={{ opacity: 0, y: 10 }} animate={seen ? { opacity: 1, y: 0 } : {}} transition={{ delay: 2 + i * 1.4, duration: 1 }} className={i === 1 ? "text-glow font-display text-4xl font-semibold md:text-6xl" : "text-lg text-starlight/80 md:text-xl"}>
            {t}
          </motion.p>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={seen ? { opacity: 1 } : {}} transition={{ delay: 6.5 }} className="relative z-10 mt-10 flex flex-wrap justify-center gap-3">
        <button onClick={onReplay} className="pulseglow rounded-full bg-glow px-6 py-3 font-semibold text-night">↺ Replay our movie</button>
        <a href="#story" className="rounded-full border border-starlight/40 px-6 py-3 text-starlight hover:bg-starlight/10">Our favourite memories</a>
      </motion.div>
      <p className="relative z-10 mt-16 font-hand text-lg text-starlight/50">made with love by {couple.him}, for {couple.her}</p>
    </section>
  );
}
