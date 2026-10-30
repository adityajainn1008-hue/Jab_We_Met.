import { motion } from "framer-motion";
import { Character } from "./Character";
import { Heart, Stars } from "./Ambient";
import type { SceneKind } from "@/content/story";
import { universeWords } from "@/content/story";

const Frame = ({ night, children }: { night?: boolean; children: React.ReactNode }) => (
  <div className={`grain relative flex h-80 w-full items-end justify-center overflow-hidden rounded-[2rem] md:h-96 ${night ? "bg-night-sky" : "bg-dawn"} shadow-glow`}>
    {night && <Stars count={40} seed={5} />}
    {children}
  </div>
);

const Bubble = ({ text, side, delay }: { text: string; side: "l" | "r"; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 10, scale: 0.9 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className={`max-w-[75%] rounded-2xl px-3 py-1.5 text-xs ${side === "l" ? "self-start rounded-bl-sm bg-card text-foreground" : "self-end rounded-br-sm bg-primary text-primary-foreground"}`}
  >
    {text}
  </motion.div>
);

export function Scene({ kind }: { kind: SceneKind }) {
  switch (kind) {
    case "chat":
      return (
        <Frame>
          <div className="absolute left-1/2 top-6 flex w-56 -translate-x-1/2 flex-col gap-2 rounded-3xl border border-border bg-muted/80 p-3">
            <p className="text-center text-[10px] font-semibold tracking-widest text-muted-foreground">JAB WE MET · group</p>
            <Bubble side="r" text="good morning ☀️" delay={0.2} />
            <Bubble side="l" text="raat ko good morning?? 😂" delay={0.8} />
            <Bubble side="l" text="kuch bhi bolta hai ye" delay={1.3} />
            <Bubble side="r" text="…haan toh?" delay={1.8} />
          </div>
          <div className="mb-2 flex w-full justify-between px-6">
            <Character who="aditya" pose="idle" size={80} />
            <Character who="ritu" pose="laugh" flip size={80} />
          </div>
        </Frame>
      );
    case "argue":
      return (
        <Frame>
          <motion.div className="absolute top-10 flex gap-6 font-hand text-3xl text-burgundy" animate={{ rotate: [-3, 3, -3] }} transition={{ repeat: Infinity, duration: 1 }}>
            <span>ganna!</span><span>ganni!</span>
          </motion.div>
          <div className="mb-2 flex gap-10">
            <Character who="aditya" pose="argue" size={100} />
            <Character who="ritu" pose="argue" flip size={100} />
          </div>
        </Frame>
      );
    case "feelings":
      return (
        <Frame>
          <motion.div className="absolute top-12 font-hand text-2xl text-muted-foreground" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 2 }}>
            typing…
          </motion.div>
          <div className="mb-2 flex gap-16">
            <Character who="aditya" pose="shy" size={100} />
            <Character who="ritu" pose="shy" flip size={100} />
          </div>
        </Frame>
      );
    case "propose":
      return (
        <Frame night>
          <motion.div className="absolute top-12 z-10" animate={{ scale: [1, 1.25, 1, 1.35, 1] }} transition={{ repeat: Infinity, duration: 0.9 }}>
            <Heart className="h-14 w-14 text-rose" />
          </motion.div>
          <p className="absolute top-32 font-hand text-xl text-starlight/80">dhak dhak dhak…</p>
          <div className="relative z-10 mb-2 flex gap-12">
            <Character who="aditya" pose="hold" size={100} />
            <Character who="ritu" pose="sad" flip size={100} />
          </div>
        </Frame>
      );
    case "wait":
      return (
        <Frame>
          <div className="absolute inset-x-6 top-6 grid grid-cols-7 gap-1.5">
            {Array.from({ length: 21 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0.15, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className={`flex aspect-square items-center justify-center rounded-lg text-[10px] font-semibold ${i === 20 ? "bg-glow text-night" : "bg-secondary text-burgundy"}`}
              >
                {i === 20 ? "🪔" : i + 1}
              </motion.div>
            ))}
          </div>
          <div className="mb-1"><Character who="aditya" pose="sad" size={80} /></div>
        </Frame>
      );
    case "diwali":
      return (
        <Frame night>
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div key={i} className="absolute h-2 w-2 rounded-full bg-gold" style={{ left: `${15 + i * 17}%`, top: `${15 + (i % 2) * 15}%`, boxShadow: "0 0 30px 14px var(--rose)" }} animate={{ scale: [0, 3, 0], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2, delay: i * 0.4 }} />
          ))}
          <motion.p initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2 }} className="text-glow absolute top-20 font-display text-3xl italic text-starlight">
            “I love you poora.”
          </motion.p>
          <div className="relative z-10 mb-2 flex items-end gap-1">
            <Character who="aditya" pose="hold" size={95} />
            <Character who="ritu" pose="hold" flip size={95} />
          </div>
          <div className="absolute bottom-2 flex w-full justify-around">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="flicker h-4 w-2.5 rounded-full bg-gold" style={{ boxShadow: "0 0 14px 4px var(--gold)", animationDelay: `${i * 0.1}s` }} />
                <div className="h-2 w-6 rounded-b-full bg-burgundy" />
              </div>
            ))}
          </div>
        </Frame>
      );
    case "call":
      return (
        <Frame>
          <div className="absolute top-8 rounded-2xl bg-night px-5 py-3 text-center text-starlight">
            <p className="text-[10px] tracking-widest text-starlight/60">CALL ENDED</p>
            <p className="font-display text-3xl">06:00</p>
          </div>
          <div className="mb-2 flex gap-20">
            <Character who="aditya" pose="laugh" size={90} />
            <Character who="ritu" pose="shy" flip size={90} />
          </div>
        </Frame>
      );
    case "universe":
      return (
        <Frame night>
          <div className="absolute inset-0">
            {universeWords.map((w, i) => {
              const a = (i / universeWords.length) * Math.PI * 2;
              return (
                <motion.span key={w} className="absolute left-1/2 top-[42%] whitespace-nowrap rounded-full border border-rose/40 bg-night/60 px-2 py-0.5 text-[10px] text-starlight" initial={{ x: 0, y: 0, opacity: 0 }} whileInView={{ x: Math.cos(a) * 120 - 40, y: Math.sin(a) * 90, opacity: 1 }} transition={{ delay: i * 0.1, duration: 1 }}>
                  {w}
                </motion.span>
              );
            })}
          </div>
          <div className="relative z-10 mb-2 flex gap-2">
            <Character who="aditya" pose="idle" size={80} />
            <Character who="ritu" pose="idle" flip size={80} />
          </div>
        </Frame>
      );
    case "forever":
      return (
        <Frame night>
          {[0.6, 0.8, 1].map((s, i) => (
            <div key={i} className="absolute bottom-4 flex gap-1 opacity-40" style={{ transform: `translateX(${(i - 1) * 110}px) scale(${s})`, opacity: 0.25 + i * 0.3 }}>
              <Character who="aditya" pose="hold" size={70} />
              <Character who="ritu" pose="hold" flip size={70} />
            </div>
          ))}
        </Frame>
      );
  }
}
