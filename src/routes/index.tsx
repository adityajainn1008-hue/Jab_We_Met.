import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { CupidGame } from "@/components/love/CupidGame";
import { Opening } from "@/components/love/Opening";
import { Chapters } from "@/components/love/Chapters";
import { CatchHearts } from "@/components/love/CatchHearts";
import { Quiz } from "@/components/love/Quiz";
import { Letter } from "@/components/love/Letter";
import { Finale } from "@/components/love/Finale";
import { PopHearts } from "@/components/love/PopHearts";
import { SoundToggle } from "@/components/love/Ambient";
import { MemoryMatch } from "@/components/love/MemoryMatch";
import { StarConnect } from "@/components/love/StarConnect";
import { WordScramble } from "@/components/love/WordScramble";
import { PerfectTiming } from "@/components/love/PerfectTiming";
import { SneakPeek } from "@/components/love/SneakPeek";
import { SurprisePopup } from "@/components/love/SurprisePopup";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jab We Met — To Forever <3" },
      { name: "description", content: "An animated love story from Aditya to Ritu — Cupid's game, nine chapters, a secret letter and forever." },
      { property: "og:title", content: "Jab We Met — To Forever <3" },
      { property: "og:description", content: "Two stubborn souls. One unexpected love story." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Stage = "cupid" | "opening" | "movie";

function Index() {
  const [stage, setStage] = useState<Stage>("cupid");
  const [wonBefore, setWonBefore] = useState(false);
  useEffect(() => setWonBefore(!!localStorage.getItem("jwm-cupid-won")), []);

  const go = (s: Stage) => {
    if (s === "opening") localStorage.setItem("jwm-cupid-won", "1");
    window.scrollTo({ top: 0 });
    setStage(s);
  };

  return (
    <MotionConfig reducedMotion="user">
      <SoundToggle />
      <AnimatePresence mode="wait">
        <motion.main key={stage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: "blur(8px)" }} transition={{ duration: 0.8 }}>
          {stage === "cupid" && <CupidGame onUnlock={() => go("opening")} canSkip={wonBefore} />}
          {stage === "opening" && <Opening onStart={() => go("movie")} />}
          {stage === "movie" && (
            <>
              <nav className="sticky top-0 z-30 flex justify-start gap-3 bg-background/80 px-4 py-4 pr-28 text-[11px] md:justify-center md:gap-6 font-semibold uppercase tracking-widest text-burgundy backdrop-blur md:pr-4">
                <a href="#story">Story</a><a href="#games">Games</a><a href="#letter">Letter</a><a href="#finale">Forever</a>
              </nav>
              <Chapters />
              <section id="games" className="relative overflow-hidden bg-dawn px-5 py-24">
                <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-rose/30 blur-3xl" />
                <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-gold/30 blur-3xl" />
                <div className="relative mx-auto max-w-6xl">
                  <div className="mb-12 text-center">
                    <p className="font-hand text-2xl text-rose">play with me</p>
                    <h2 className="shimmer-text text-5xl font-semibold md:text-6xl">Our Little Game Room</h2>
                    <p className="mx-auto mt-3 max-w-md text-muted-foreground">Six tiny games, six secret messages. Win each one to unlock them all.</p>
                  </div>
                  <div className="grid gap-8 md:grid-cols-2">
                    <CatchHearts />
                    <MemoryMatch />
                    <StarConnect />
                    <Quiz />
                    <WordScramble />
                    <PerfectTiming />
                  </div>
                </div>
              </section>
              <Letter />
              <Finale onReplay={() => go("cupid")} />
              <PopHearts />
              <SurprisePopup />
              <SneakPeek />
            </>
          )}
        </motion.main>
      </AnimatePresence>
    </MotionConfig>
  );
}
