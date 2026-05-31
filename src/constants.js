export const COL = {
  bg: "#0F1115",
  panel: "#171A21",
  panel2: "#1E222B",
  line: "#2A2F3A",
  text: "#E7E9EE",
  dim: "#9098A6",
  accent: "#C8A24B",
  green: "#5FA86A",
  blue: "#5B86C4",
  orange: "#D08A3E",
  red: "#C75B5B",
  gray: "#6B7280",
};

export const PHASES = [
  {
    n: 1,
    nom: "Observation pure",
    periode: "15 juin → 5 juillet",
    start: new Date("2026-06-15"),
    end: new Date("2026-07-05"),
    obj: "Cartographier l'écosystème humain & système",
    couleur: COL.gray,
  },
  {
    n: 2,
    nom: "Entretiens approfondis",
    periode: "6 → 26 juillet",
    start: new Date("2026-07-06"),
    end: new Date("2026-07-26"),
    obj: "Collecter la matière qualitative par poste",
    couleur: COL.blue,
  },
  {
    n: 3,
    nom: "Synthèse & restitution",
    periode: "27 juillet → 23 août",
    start: new Date("2026-07-27"),
    end: new Date("2026-08-23"),
    obj: "Croiser, analyser, présenter à la direction",
    couleur: COL.orange,
  },
  {
    n: 4,
    nom: "Lancement chantiers",
    periode: "24 août → 20 septembre",
    start: new Date("2026-08-24"),
    end: new Date("2026-09-20"),
    obj: "Quick wins mesurables, premières transformations",
    couleur: COL.green,
  },
];

export function phaseEnCours() {
  const now = new Date();
  return PHASES.find((p) => now >= p.start && now <= p.end) || PHASES[0];
}

export function progressPhase(phase) {
  const now = new Date();
  if (now < phase.start) return 0;
  if (now > phase.end) return 100;
  const total = phase.end - phase.start;
  const elapsed = now - phase.start;
  return Math.round((elapsed / total) * 100);
}

export const TYPES = [
  "Observation",
  "Conversation informelle",
  "Signal faible",
  "Fait chiffré",
  "Tension repérée",
  "Idée à creuser",
  "Décision direction",
  "Document collecté",
];

export const THEMES = [
  "Humain",
  "Système",
  "Chiffrage",
  "Atelier",
  "Pose",
  "Marge",
  "Délais",
  "Qualité/SAV",
  "Commercial",
  "RH",
  "Gouvernance",
  "Stratégique",
];

export const CRITICITE = [
  { label: "Critique", c: COL.red },
  { label: "Important", c: COL.orange },
  { label: "À noter", c: "#C9B458" },
  { label: "Anecdotique", c: COL.gray },
];

export const POSTE_COULEUR = {
  "Chef d'atelier": COL.blue,
  "Conducteur de travaux": COL.blue,
  "Dessinateur-chiffreur": COL.blue,
  "Compagnon atelier": COL.green,
  Poseur: COL.green,
  DAF: COL.red,
  DG: COL.red,
  "RH/Comptabilité": COL.orange,
};

export const DB = {
  journal: "ccd5aacf-26e8-4257-bba7-80aa88ebddf8",
  personnes: "07efc4b5-3c65-492c-a180-4e001de58974",
  entretiens: "a006f519-fd87-46fb-96e7-368677bd58d5",
  systeme: "1f8ff0fd-16c4-4781-a7c5-b5a423557267",
  quickWins: "a1bb7903-b186-4e6c-88d6-82d29a561d88",
  questions: "5f9cf3d0-6c69-45d7-937e-5ba828bfc2eb",
  syntheses: "569af604-bb82-408d-894b-78684e3906f6",
};
