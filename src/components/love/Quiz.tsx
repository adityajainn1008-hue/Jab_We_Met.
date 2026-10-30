import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { quiz, quizResults } from "@/content/story";
import { Character } from "./Character";
import { sfx } from "@/lib/sound";

export function Quiz() {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const done = i >= quiz.length;
  const q = quiz[Math.min(i, quiz.length - 1)]!;

  const pick = (k: number) => {
    if (picked !== null) return;
    setPicked(k);
    if (k === q.answer) { sfx.hit(); setScore((s) => s + 1); } else sfx.wrong();
    setTimeout(() => { setPicked(null); setI((n) => n + 1); }, 1500);
  };

  return (
    <div id="quiz" className="game-card">
      <p className="font-hand text-xl text-rose">mini-game</p>
      <h3 className="text-3xl font-semibold text-burgundy">How Well Do You Know Us?</h3>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
        <motion.div className="h-full bg-glow" animate={{ width: `${(Math.min(i, quiz.length) / quiz.length) * 100}%` }} />
      </div>
      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div key={i} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="mt-6">
            <p className="text-xs text-muted-foreground">Question {i + 1} of {quiz.length}</p>
            <p className="mt-1 font-display text-2xl">{q.q}</p>
            <div className="mt-5 grid gap-2">
              {q.options.map((o, k) => {
                const state = picked === null ? "" : k === q.answer ? "bg-primary text-primary-foreground border-primary" : k === picked ? "bg-destructive/15 border-destructive" : "opacity-50";
                return (
                  <motion.button key={k} whileTap={{ scale: 0.97 }} animate={picked === k && k !== q.answer ? { x: [0, -6, 6, -4, 0] } : {}} onClick={() => pick(k)} className={`rounded-2xl border border-border px-4 py-3 text-left transition-colors hover:bg-secondary ${state}`}>
                    {o}
                  </motion.button>
                );
              })}
            </div>
            {picked !== null && <p className="mt-3 font-hand text-xl text-rose">{picked === q.answer ? "Correct! " : "Oops! "}{q.note}</p>}
          </motion.div>
        ) : (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-6 flex flex-col items-center text-center">
            <div className="flex">
              <Character who="aditya" pose={score >= 3 ? "laugh" : "argue"} size={70} />
              <Character who="ritu" pose={score >= 3 ? "shy" : "argue"} flip size={70} />
            </div>
            <p className="mt-3 font-display text-4xl text-burgundy">{score}/{quiz.length}</p>
            <p className="mt-2 max-w-sm text-lg">{quizResults.find((r) => score >= r.min)?.text}</p>
            <button onClick={() => { setI(0); setScore(0); sfx.click(); }} className="mt-5 rounded-full bg-primary px-6 py-2.5 text-primary-foreground">Play again</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
