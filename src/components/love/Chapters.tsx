import { motion } from "framer-motion";
import { chapters } from "@/content/story";
import { Scene } from "./Scenes";

export function Chapters() {
  return (
    <section id="story" className="relative mx-auto max-w-6xl px-5 py-24">
      <p className="text-center font-hand text-2xl text-rose">our story, in nine scenes</p>
      <h2 className="mt-1 text-center text-4xl font-semibold text-burgundy md:text-6xl">The Movie</h2>
      <div className="relative mt-20 space-y-28 md:space-y-40">
        <div className="absolute left-1/2 top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-rose to-transparent md:block" />
        {chapters.map((c, i) => (
          <article key={c.n} className={`relative grid items-center gap-8 md:grid-cols-2 md:gap-16 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8 }}>
              <Scene kind={c.scene} />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: i % 2 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8, delay: 0.15 }}>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose">
                Chapter {c.n} · {c.kicker}
              </p>
              <h3 className={`mt-3 font-semibold text-burgundy ${c.scene === "diwali" || c.scene === "forever" ? "text-4xl md:text-6xl" : "text-3xl md:text-4xl"}`}>{c.title}</h3>
              <div className="mt-5 space-y-3 text-lg leading-relaxed text-foreground/80">
                {c.body.map((p, j) => (
                  <motion.p key={j} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 + j * 0.3 }} className={c.scene === "forever" ? "font-display text-2xl italic text-burgundy" : ""}>
                    {p}
                  </motion.p>
                ))}
              </div>
              {c.hinglish && <p className="mt-5 border-l-2 border-rose pl-4 font-hand text-2xl text-muted-foreground">{c.hinglish}</p>}
            </motion.div>
          </article>
        ))}
      </div>
    </section>
  );
}
