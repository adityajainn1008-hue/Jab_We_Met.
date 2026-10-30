// Tiny Web Audio synth — all sounds and music are generated live (original, no licensing needed).
let ctx: AudioContext | null = null;
let sfxOn = true;

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const C = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!C) return null;
    try {
      ctx = new C();
    } catch {
      return null;
    }
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function setSfx(on: boolean) {
  sfxOn = on;
}

function tone(freq: number, dur = 0.15, type: OscillatorType = "sine", vol = 0.08, delay = 0, slideTo?: number) {
  if (!sfxOn) return;
  const c = ac();
  if (!c) return;
  const t = c.currentTime + delay;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + dur + 0.05);
}

export const sfx = {
  pop: () => tone(880, 0.12, "sine", 0.08, 0, 1320),
  shoot: () => tone(600, 0.25, "triangle", 0.05, 0, 200),
  hit: () => {
    tone(660, 0.12, "sine", 0.08);
    tone(990, 0.18, "sine", 0.06, 0.08);
  },
  miss: () => tone(220, 0.2, "sine", 0.05, 0, 160),
  win: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.35, "triangle", 0.06, i * 0.12)),
  click: () => tone(1200, 0.05, "sine", 0.04),
  wrong: () => tone(300, 0.25, "sawtooth", 0.025, 0, 200),
};

// ---- Gentle music box loop ----
let master: GainNode | null = null;
let timer: number | null = null;
const prog = [
  [261.63, 329.63, 392.0, 523.25],
  [220.0, 261.63, 329.63, 440.0],
  [174.61, 220.0, 261.63, 349.23],
  [196.0, 246.94, 293.66, 392.0],
];

import song from "@/assets/tum-tak.mp3.asset.json";
let audio: HTMLAudioElement | null = null;

export function startMusic() {
  if (typeof window === "undefined") return;
  if (!audio) { audio = new Audio(song.url); audio.loop = true; audio.volume = 0.6; }
  void audio.play().catch(() => startSynth());
}

function startSynth() {
  const c = ac();
  if (!c || timer !== null) return;
  master = c.createGain();
  master.gain.setValueAtTime(0.0001, c.currentTime);
  master.gain.exponentialRampToValueAtTime(0.5, c.currentTime + 2);
  master.connect(c.destination);
  let step = 0;
  const play = () => {
    if (!master) return;
    const chord = prog[Math.floor(step / 8) % prog.length]!;
    const pattern = [0, 1, 2, 3, 2, 1, 2, 3];
    const f = chord[pattern[step % 8]!]! * 2;
    const t = c.currentTime;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = "sine";
    o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.06, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
    o.connect(g).connect(master);
    o.start(t);
    o.stop(t + 1.3);
    if (step % 8 === 0) {
      const b = c.createOscillator();
      const bg = c.createGain();
      b.type = "triangle";
      b.frequency.value = chord[0]! / 2;
      bg.gain.setValueAtTime(0.0001, t);
      bg.gain.exponentialRampToValueAtTime(0.05, t + 0.1);
      bg.gain.exponentialRampToValueAtTime(0.0001, t + 2.6);
      b.connect(bg).connect(master);
      b.start(t);
      b.stop(t + 2.7);
    }
    step++;
  };
  play();
  timer = window.setInterval(play, 340);
}

export function stopMusic() {
  audio?.pause();
  const c = ac();
  if (timer !== null) window.clearInterval(timer);
  timer = null;
  if (c && master) {
    const m = master;
    m.gain.cancelScheduledValues(c.currentTime);
    m.gain.setValueAtTime(m.gain.value, c.currentTime);
    m.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 1);
    setTimeout(() => m.disconnect(), 1200);
  }
  master = null;
}

// Deterministic random (SSR-safe star fields)
export function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}
