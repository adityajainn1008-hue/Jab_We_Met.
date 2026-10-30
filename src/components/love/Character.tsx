import { useId } from "react";
import { cn } from "@/lib/utils";

export type Pose = "idle" | "walk" | "wave" | "shy" | "laugh" | "hold" | "argue" | "sad";

interface Props {
  who: "aditya" | "ritu";
  pose?: Pose;
  flip?: boolean;
  size?: number;
  className?: string;
}

/** Original chibi characters. Aditya: messy quiff, cream hoodie, jeans. Ritu: long braid-hair, burgundy kurti, bindi, jhumkas. */
export function Character({ who, pose = "idle", flip, size = 150, className }: Props) {
  const uid = useId().replace(/:/g, "");
  const R = who === "ritu";
  const closed = pose === "shy" || pose === "laugh";
  const g = (n: string) => `url(#${n}-${uid})`;
  const top = R ? g("kurti") : g("hood");
  const outline = "var(--ink)";
  const sw = 1.6;

  return (
    <div
      className={cn("char inline-block", `pose-${pose}`, className)}
      style={{ width: size, height: size * (200 / 120), transform: flip ? "scaleX(-1)" : undefined }}
      aria-label={R ? "Ritu" : "Aditya"}
      role="img"
    >
      <svg viewBox="0 0 120 200" className="char-body h-full w-full overflow-visible">
        <defs>
          <radialGradient id={`skin-${uid}`} cx="45%" cy="40%" r="65%">
            <stop offset="0%" stopColor="var(--skin-light)" />
            <stop offset="100%" stopColor="var(--skin)" />
          </radialGradient>
          <linearGradient id={`hair-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--hair-light)" />
            <stop offset="100%" stopColor="var(--hair)" />
          </linearGradient>
          <linearGradient id={`kurti-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--rose)" />
            <stop offset="100%" stopColor="var(--ritu-top)" />
          </linearGradient>
          <linearGradient id={`hood-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--adi-top)" />
            <stop offset="100%" stopColor="var(--adi-hood)" />
          </linearGradient>
          <radialGradient id={`eye-${uid}`} cx="50%" cy="65%" r="60%">
            <stop offset="0%" stopColor="var(--eye-light)" />
            <stop offset="100%" stopColor="var(--ink)" />
          </radialGradient>
        </defs>

        <ellipse cx="60" cy="196" rx="28" ry="4" fill="var(--shadow-ink)" />

        {/* back hair */}
        {R && (
          <path d="M26 50 Q18 110 30 140 Q44 150 60 146 Q76 150 90 140 Q102 110 94 50 Z" fill={g("hair")} stroke={outline} strokeWidth={sw} />
        )}

        {/* legs */}
        <g className="leg leg-l">
          <path d="M45 146 L44 184 Q44 188 49 188 L53 188 Q55 188 55 184 L56 146 Z" fill={R ? "var(--ritu-legs)" : "var(--adi-legs)"} stroke={outline} strokeWidth={sw} />
          <path d="M41 186 Q41 193 50 193 Q57 193 57 188 Q50 184 41 186Z" fill="var(--shoe)" stroke={outline} strokeWidth={sw} />
        </g>
        <g className="leg leg-r">
          <path d="M64 146 L65 184 Q65 188 69 188 L73 188 Q76 188 76 184 L75 146 Z" fill={R ? "var(--ritu-legs)" : "var(--adi-legs)"} stroke={outline} strokeWidth={sw} />
          <path d="M63 188 Q63 193 70 193 Q79 193 79 186 Q70 184 63 188Z" fill="var(--shoe)" stroke={outline} strokeWidth={sw} />
        </g>

        {/* left arm */}
        <g className="arm arm-l">
          <path d="M34 92 Q26 112 28 132 Q31 136 35 132 Q38 114 42 98 Z" fill={top} stroke={outline} strokeWidth={sw} />
          <circle cx="31.5" cy="135" r="5.5" fill={g("skin")} stroke={outline} strokeWidth={sw} />
          {R && <rect x="27" y="126" width="9" height="2.5" rx="1" fill="var(--gold)" />}
        </g>

        {/* torso */}
        {R ? (
          <>
            <path d="M40 86 Q60 80 80 86 Q86 120 94 152 Q60 162 26 152 Q34 120 40 86Z" fill={top} stroke={outline} strokeWidth={sw} />
            <path d="M30 146 Q60 156 90 146" stroke="var(--gold)" strokeWidth="2.5" fill="none" strokeDasharray="1 3" strokeLinecap="round" />
            <circle cx="52" cy="118" r="1.6" fill="var(--gold)" />
            <circle cx="66" cy="126" r="1.6" fill="var(--gold)" />
            <circle cx="58" cy="136" r="1.6" fill="var(--gold)" />
            <path d="M28 88 Q60 108 92 88 L96 96 Q60 118 24 96Z" fill="var(--dupatta)" stroke={outline} strokeWidth={sw} opacity=".92" />
          </>
        ) : (
          <>
            <path d="M36 88 Q60 80 84 88 Q88 118 86 148 Q60 154 34 148 Q32 118 36 88Z" fill={top} stroke={outline} strokeWidth={sw} />
            <path d="M46 88 Q60 104 74 88" fill="var(--adi-hood)" stroke={outline} strokeWidth={sw} />
            <path d="M54 96 L53 110 M66 96 L67 110" stroke={outline} strokeWidth="1.2" strokeLinecap="round" />
            <path d="M44 122 Q60 128 76 122 L74 134 Q60 138 46 134Z" fill="var(--adi-hood)" stroke={outline} strokeWidth="1.2" />
            <path d="M56 108 Q60 104 64 108 Q60 114 56 108Z" fill="var(--rose)" />
          </>
        )}

        {/* right arm */}
        <g className={cn("arm arm-r", pose === "hold" && "arm-reach")}>
          <path d="M86 92 Q94 112 92 132 Q89 136 85 132 Q82 114 78 98 Z" fill={top} stroke={outline} strokeWidth={sw} />
          <circle cx="88.5" cy="135" r="5.5" fill={g("skin")} stroke={outline} strokeWidth={sw} />
          {R && <rect x="84" y="126" width="9" height="2.5" rx="1" fill="var(--gold)" />}
        </g>

        {/* neck */}
        <path d="M54 74 L54 88 Q60 92 66 88 L66 74Z" fill="var(--skin)" stroke={outline} strokeWidth={sw} />

        <g className="head">
          {/* ears */}
          <ellipse cx="29" cy="56" rx="5" ry="6.5" fill={g("skin")} stroke={outline} strokeWidth={sw} />
          <ellipse cx="91" cy="56" rx="5" ry="6.5" fill={g("skin")} stroke={outline} strokeWidth={sw} />
          {R && (
            <g className="jhumka">
              <circle cx="28" cy="65" r="1.6" fill="var(--gold)" />
              <path d="M24.5 67 Q28 74 31.5 67Z" fill="var(--gold)" />
              <circle cx="92" cy="65" r="1.6" fill="var(--gold)" />
              <path d="M88.5 67 Q92 74 95.5 67Z" fill="var(--gold)" />
            </g>
          )}
          {/* face */}
          <path d="M31 50 Q31 20 60 20 Q89 20 89 50 Q89 82 60 83 Q31 82 31 50Z" fill={g("skin")} stroke={outline} strokeWidth={sw} />

          {/* front hair */}
          {R ? (
            <>
              <path d="M28 54 Q24 16 60 15 Q96 16 92 54 Q88 40 78 32 Q70 42 50 42 Q58 36 60 28 Q46 40 34 44 Q30 48 28 54Z" fill={g("hair")} stroke={outline} strokeWidth={sw} strokeLinejoin="round" />
              <path d="M46 22 Q54 20 62 22" stroke="var(--hair-shine)" strokeWidth="2" fill="none" strokeLinecap="round" />
              <circle cx="84" cy="30" r="4" fill="var(--rose)" stroke={outline} strokeWidth="1" />
              <circle cx="84" cy="30" r="1.5" fill="var(--gold)" />
            </>
          ) : (
            <>
              <path
                d="M28 52 Q24 26 42 18 Q50 8 64 12 Q72 6 78 14 Q94 20 92 50 Q86 36 76 32 Q78 40 70 42 Q70 34 62 32 Q58 40 48 40 Q50 34 46 32 Q36 38 28 52Z"
                fill={g("hair")}
                stroke={outline}
                strokeWidth={sw}
                strokeLinejoin="round"
              />
              <path d="M50 18 Q58 14 66 17" stroke="var(--hair-shine)" strokeWidth="2" fill="none" strokeLinecap="round" />
            </>
          )}
          {R && <circle cx="60" cy="44" r="1.8" fill="var(--bindi)" />}

          {/* brows */}
          {pose === "argue" ? (
            <>
              <path d="M41 45 L53 49" stroke={outline} strokeWidth="2.4" strokeLinecap="round" />
              <path d="M79 45 L67 49" stroke={outline} strokeWidth="2.4" strokeLinecap="round" />
            </>
          ) : pose === "sad" ? (
            <>
              <path d="M42 48 L52 45" stroke={outline} strokeWidth="2" strokeLinecap="round" />
              <path d="M78 48 L68 45" stroke={outline} strokeWidth="2" strokeLinecap="round" />
            </>
          ) : (
            <>
              <path d="M42 46 Q47 43 53 45" stroke={outline} strokeWidth="1.8" fill="none" strokeLinecap="round" />
              <path d="M67 45 Q73 43 78 46" stroke={outline} strokeWidth="1.8" fill="none" strokeLinecap="round" />
            </>
          )}

          {/* eyes */}
          {closed ? (
            <>
              <path d="M42 57 Q48 51 54 57" stroke={outline} strokeWidth="2.6" fill="none" strokeLinecap="round" />
              <path d="M66 57 Q72 51 78 57" stroke={outline} strokeWidth="2.6" fill="none" strokeLinecap="round" />
            </>
          ) : (
            <g className="eyes">
              <g className="eye">
                <ellipse cx="48" cy="57" rx="5" ry="6.5" fill={g("eye")} />
                <circle cx="49.8" cy="54.5" r="2" fill="var(--card)" />
                <circle cx="46.5" cy="59.5" r="0.9" fill="var(--card)" />
              </g>
              <g className="eye">
                <ellipse cx="72" cy="57" rx="5" ry="6.5" fill={g("eye")} />
                <circle cx="73.8" cy="54.5" r="2" fill="var(--card)" />
                <circle cx="70.5" cy="59.5" r="0.9" fill="var(--card)" />
              </g>
              {R && (
                <>
                  <path d="M43 52 L40 49.5 M44.5 51 L42.5 48" stroke={outline} strokeWidth="1.3" strokeLinecap="round" />
                  <path d="M77 52 L80 49.5 M75.5 51 L77.5 48" stroke={outline} strokeWidth="1.3" strokeLinecap="round" />
                </>
              )}
            </g>
          )}

          {/* blush */}
          <ellipse cx="40" cy="67" rx={pose === "shy" ? 7 : 5} ry="3" fill="var(--blush)" opacity={pose === "shy" ? 0.95 : 0.55} />
          <ellipse cx="80" cy="67" rx={pose === "shy" ? 7 : 5} ry="3" fill="var(--blush)" opacity={pose === "shy" ? 0.95 : 0.55} />
          {pose === "shy" && (
            <g stroke="var(--blush)" strokeWidth="1.2" strokeLinecap="round">
              <path d="M36 66 L38 69 M40 65 L42 68 M76 66 L78 69 M80 65 L82 68" />
            </g>
          )}
          <path d="M59 63 Q60 65 61 63" stroke={outline} strokeWidth="1.2" fill="none" strokeLinecap="round" />

          {/* mouth */}
          {pose === "laugh" ? (
            <>
              <path d="M51 69 Q60 82 69 69 Z" fill="var(--mouth)" stroke={outline} strokeWidth="1.4" strokeLinejoin="round" />
              <path d="M55 76 Q60 79 65 76" fill="var(--blush)" />
            </>
          ) : pose === "argue" ? (
            <ellipse cx="60" cy="72" rx="4.5" ry="3.5" fill="var(--mouth)" stroke={outline} strokeWidth="1.3" />
          ) : pose === "sad" ? (
            <path d="M54 74 Q60 69 66 74" stroke={outline} strokeWidth="2" fill="none" strokeLinecap="round" />
          ) : pose === "shy" ? (
            <path d="M56 71 Q60 73 64 71" stroke={outline} strokeWidth="1.8" fill="none" strokeLinecap="round" />
          ) : R ? (
            <path d="M54 70 Q60 76 66 70" stroke={outline} strokeWidth="2" fill="var(--mouth)" strokeLinecap="round" />
          ) : (
            <path d="M53 70 Q61 76 68 67" stroke={outline} strokeWidth="2.1" fill="none" strokeLinecap="round" />
          )}
        </g>
      </svg>
    </div>
  );
}
