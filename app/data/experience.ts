export type ExperienceEntry = {
  start: string;
  end: string;
  title: string;
  org: string;
};

// Note: the Framer source also had a "2018–2019 Bachelor Thesis Student · Apple" entry
// that looked like unedited template filler, not real — omitted here pending confirmation.
export const experience: ExperienceEntry[] = [
  { start: "09/2025", end: "06/2026", title: "UX Intern / Project Student", org: "Cstrider" },
  { start: "01/2025", end: "06/2025", title: "Master Thesis Student", org: "Autoliv Sweden" },
  { start: "01/2024", end: "06/2024", title: "Junior Research Associate", org: "Chalmers University of Technology" },
];
