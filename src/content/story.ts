// ✏️ EDIT EVERYTHING PERSONAL HERE — names, dates, chapters, quiz, letter.
// Colours live in src/styles.css (:root block).

export const couple = {
  him: "Aditya",
  her: "Ritu",
  title: "JAB WE MET",
  subtitle: "TO FOREVER <3",
  proposeDate: "10 October 2024",
  yesDate: "1 November 2024",
};

export type SceneKind =
  | "chat"
  | "argue"
  | "feelings"
  | "propose"
  | "wait"
  | "diwali"
  | "call"
  | "universe"
  | "forever";

export interface Chapter {
  n: number;
  title: string;
  kicker: string;
  body: string[];
  hinglish?: string;
  scene: SceneKind;
}

export const chapters: Chapter[] = [
  {
    n: 1,
    kicker: "The beginning",
    title: "The Lucky Group Chat",
    scene: "chat",
    body: [
      "We met in an Instagram group chat called “JAB WE MET.” Aditya wasn't very active — but one night he typed a simple good morning.",
      "A playful girl started teasing him for it. That girl would eventually become his favourite person.",
    ],
    hinglish: "Vo kehte haina, jinka milna likha hota hai, vo kaise na kaise mil hee jaate hai.",
  },
  {
    n: 2,
    kicker: "Nok-jhok",
    title: "Ganni Ladki, Ganna Ladka",
    scene: "argue",
    body: [
      "Our stubborn arguments and group-chat spam slowly turned into direct messages.",
      "She became my teacher — teaching me how to impress a girl, without knowing she was already winning my heart.",
    ],
    hinglish: "Jo ladki mujhse sabse jyada chidti thi, wahi ek din meri sabse badi aadat ban gayi.",
  },
  {
    n: 3,
    kicker: "Something changed",
    title: "When Teasing Became Feelings",
    scene: "feelings",
    body: [
      "We started waiting for each other's replies. Small arguments, jealousy, misunderstandings and silly fights began to feel different.",
      "Neither of us fully understood when friendship started becoming love.",
    ],
  },
  {
    n: 4,
    kicker: "10 October 2024",
    title: "The First Proposal",
    scene: "propose",
    body: [
      "Aditya proposed to Ritu — the first time he had ever proposed to anyone in his life.",
      "His heart was racing. He was scared that their whole journey could end in a second. Ritu asked for time.",
    ],
    hinglish: "“Main wait karunga, kitna bhi time lage.”",
  },
  {
    n: 5,
    kicker: "Anticipation",
    title: "The 21-Day Wait",
    scene: "wait",
    body: [
      "Twenty-one days of normal conversations with a not-so-normal heartbeat.",
      "Every morning: will she say it today? Every night: is she thinking about me too? Diwali was getting closer.",
    ],
  },
  {
    n: 6,
    kicker: "1 November 2024 · Diwali night",
    title: "She Said Yes",
    scene: "diwali",
    body: [
      "On Diwali night, with the whole sky lit up, Ritu finally said yes.",
      "“I love you ittu sa” became “I love you poora.”",
    ],
  },
  {
    n: 7,
    kicker: "06:00 minutes",
    title: "Our First Call",
    scene: "call",
    body: [
      "Our first call lasted just six minutes. Awkward laughter, shyness, and something uniquely ours.",
      "Eventually, calls became the most special part of every single day.",
    ],
  },
  {
    n: 8,
    kicker: "Us",
    title: "Our Little Universe",
    scene: "universe",
    body: [
      "Late-night talks, random pictures, mood swings, birthdays, festivals, surprises, office-to-home calls, jealousy, arguments — and always making up.",
      "We haven't met in person yet, but we have become incredibly close.",
    ],
  },
  {
    n: 9,
    kicker: "Always",
    title: "Every Universe, Every Version",
    scene: "forever",
    body: ["In every universe, I would still find you.", "In every version, I would still choose you."],
  },
];

export const universeWords = [
  "late-night talks",
  "random pictures",
  "mood swings",
  "birthdays",
  "festivals",
  "surprises",
  "office-to-home calls",
  "jealousy",
  "making up",
];

export interface QuizQ {
  q: string;
  options: string[];
  answer: number;
  note: string;
}

export const quiz: QuizQ[] = [
  {
    q: "Where did we first meet?",
    options: ["At a Diwali party", "Instagram group chat “JAB WE MET”", "College canteen", "A train journey"],
    answer: 1,
    note: "That lucky, lucky group chat.",
  },
  {
    q: "When did Aditya propose?",
    options: ["14 February 2024", "1 November 2024", "10 October 2024", "31 December 2024"],
    answer: 2,
    note: "Heart racing, fingers shaking.",
  },
  {
    q: "How long did Ritu take to say yes?",
    options: ["2 minutes", "7 days", "21 days", "3 months"],
    answer: 2,
    note: "The longest 21 days ever.",
  },
  {
    q: "What date did our relationship officially begin?",
    options: ["1 November 2024 — Diwali", "10 October 2024", "25 December 2024", "1 January 2025"],
    answer: 0,
    note: "Diyas, fireworks, and a yes.",
  },
  {
    q: "How long was our first call?",
    options: ["2 hours", "6 minutes", "45 minutes", "30 seconds"],
    answer: 1,
    note: "Six shy, giggly minutes.",
  },
];

export const quizResults = [
  { min: 5, text: "Perfect score, bubu. Of course — you wrote half of this story. ❤️" },
  { min: 3, text: "Pretty good! But I'm keeping a list for our next call 😌" },
  { min: 0, text: "Ganni ladki! Ab toh poori kahani phir se sunani padegi…" },
];

export const letter = {
  greeting: "Dear Ritu,",
  paragraphs: [
    "Who would've thought that a random Instagram group chat, a good morning, and our endless nok-jhok would bring us here?",
    "From trying to annoy you to waiting for your messages, from our first nervous call to our everyday conversations, you became part of my life in the most unexpected way.",
    "Those 21 days taught me how special something can become when you truly care. And since 1 November 2024, every laugh, every silly fight, every late-night talk, and every little surprise has added another page to our story.",
    "Maybe we haven't met in person yet, but you have been part of so many moments that matter. I want us to keep learning each other, choosing each other, and finding our way back after every little fight.",
    "In every universe, I hope I keep finding you.",
    "This is only one chapter, bubu. The best ones are still waiting for us.",
  ],
  signoff: "Forever yours,",
  name: "Aditya ❤️",
};

// Little notes revealed by the hearts that randomly pop up while scrolling.
export const popNotes = [
  "You're my favourite notification.",
  "Still smiling about that good morning.",
  "I love you poora. Not ittu sa.",
  "Jhallo, you win every argument. Mostly.",
  "Six minutes was never enough.",
  "My heart picked you before I did.",
  "Different cities, same moon.",
  "You + me = my favourite universe.",
];

export const cupidWin = "Cupid couldn't miss this one… because this love was always meant to be. ❤️";
export const catchSecret = "You caught my hearts, but they were yours all along. I love you poora. ❤️";

// ---- New mini-games ----
export const memoryCards = ["☕", "🌧️", "🎬", "🌙", "🍫", "💍"];
export const memorySecret = "Every little memory with you matches perfectly with my heart. 💞";
// Points (x,y in %) Ritu taps in order to draw a heart constellation.
export const starPoints: [number, number][] = [
  [50, 32], [38, 18], [22, 20], [14, 36], [22, 56], [36, 70], [50, 84], [64, 70], [78, 56], [86, 36], [78, 20], [62, 18],
];
export const starSecret = "Out of all the stars in the sky, I'd still find my way to you. ✨";

// Random pop-up surprises: a tiny challenge, then a beautiful line.
export const popupLines = [
  "Tum ho toh har din thoda zyada khoobsurat lagta hai. 🌸",
  "Meri har dua mein ek naam hamesha rehta hai — tumhara. ❤",
  "You are my favourite notification, every single day.",
  "Tum tak… har raasta mujhe le hi aata hai. 🎶",
  "If love had a face, it would smile exactly like you.",
  "Duniya badal jaye, mera dil tumhara hi rahega.",
  "Every love song finally makes sense because of you.",
];

// Unscramble game words (Ritu rearranges letters).
export const scrambleWords = ["FOREVER", "JAANU", "SUKOON", "PYAAR", "DESTINY"];
export const scrambleSecret = "Letters get mixed up, but my heart never does — it always spells YOU. 💌";

// Perfect Timing game: stop the moving heart inside the glowing zone.
export const timingSecret = "Our timing was never perfect — but meeting you was the most perfect moment of my life. ⏳❤";

// Characters that sneak in from the screen edges — tap them for a sweet Hinglish note.
export const sneakLines = [
  "Oye, itna cute kaun hota hai? Tum. Sirf tum. 🥺",
  "Bas yeh batane aaya tha… I miss you already. 💗",
  "Tumhari smile dekh ke mera poora din ban jaata hai.",
  "Psst… tum meri favourite insaan ho, kisi ko batana mat. 🤫",
  "Gussa bhi karti ho toh pyaari lagti ho, kya karun? 😌",
  "Chai, baarish aur tum — perfect combo. ☕🌧️",
  "Duniya ki sabse lucky feeling? Tumhara hona. ✨",
  "Jaldi milo na, hug pending hai. 🤗",
  "Tum saath ho toh sab kuch theek lagta hai.",
  "Ek baat bolun? Tumse pyaar hai… bahut zyada. ❤",
];
