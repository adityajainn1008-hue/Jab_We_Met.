import { useMemo, useState } from "react";
import { seeded, startMusic, stopMusic, setSfx } from "@/lib/sound";
import { cn } from "@/lib/utils";

export function Stars({ count = 70, seed = 7, className }: { count?: number; seed?: number; className?: string }) {
  const stars = useMemo(() => {
    const r = seeded(seed);
    return Array.from({ length: count }, () => ({ x: r() * 100, y: r() * 100, s: r() * 2 + 1, d: r() * 4 }));
  }, [count, seed]);
  return (
    <div className={cn("pointer-events-none absolute inset-0", className)} aria-hidden>
      {stars.map((s, i) => (
        <span
          key={i}
          className="twinkle absolute rounded-full bg-starlight"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, animationDelay: `${s.d}s` }}
        />
      ))}
    </div>
  );
}

export function Heart({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 32 30" className={className} style={style} aria-hidden>
      <path d="M16 29 C6 21 0 15 0 8.5 A8 8 0 0 1 16 5 A8 8 0 0 1 32 8.5 C32 15 26 21 16 29Z" fill="currentColor" />
    </svg>
  );
}

export function FloatingHearts({ count = 12, seed = 3 }: { count?: number; seed?: number }) {
  const hs = useMemo(() => {
    const r = seeded(seed);
    return Array.from({ length: count }, () => ({ x: r() * 100, d: r() * 6, s: 10 + r() * 18, t: 5 + r() * 5 }));
  }, [count, seed]);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {hs.map((h, i) => (
        <Heart
          key={i}
          className="floatup absolute bottom-0 text-rose opacity-0"
          style={{ left: `${h.x}%`, width: h.s, animationDelay: `${h.d}s`, animationDuration: `${h.t}s` }}
        />
      ))}
    </div>
  );
}

export function SoundToggle() {
  const [music, setMusic] = useState(false);
  const [fx, setFx] = useState(true);
  return (
    <div className="fixed right-3 top-3 z-50 flex gap-2">
      <button
        onClick={() => {
          setFx(!fx);
          setSfx(!fx);
        }}
        className="rounded-full border border-rose/40 bg-night/70 px-3 py-2 text-xs text-starlight backdrop-blur"
        aria-pressed={fx}
      >
        <span className="md:hidden">{fx ? "🔊" : "🔇"}</span><span className="hidden md:inline">{fx ? "Sounds on" : "Sounds off"}</span>
      </button>
      <button
        onClick={() => {
          if (music) stopMusic();
          else startMusic();
          setMusic(!music);
        }}
        className={cn(
          "rounded-full border border-rose/40 px-3 py-2 text-xs backdrop-blur",
          music ? "bg-rose text-night" : "bg-night/70 text-starlight",
        )}
        aria-pressed={music}
      >
        <span className="md:hidden">♪</span><span className="hidden md:inline">{music ? "♪ Music on" : "♪ Play music"}</span>
      </button>
    </div>
  );
}
