export type Project = {
  slug: string;
  // TODO(sylvia): confirm the real card title — placeholder derived from the project name
  cardLabel: string;
  subtitle: string;
  comingSoon: boolean;
  href?: string;
};

export const projects: Project[] = [
  {
    slug: "halogrip",
    cardLabel: "01 / HALOGRIP",
    subtitle: "Emergency steering for autonomous vehicles",
    comingSoon: false,
    href: "/work/halogrip",
  },
  {
    slug: "coming-soon-1",
    cardLabel: "02 / Coming soon",
    subtitle: "New project — details soon",
    comingSoon: true,
  },
  {
    slug: "coming-soon-2",
    cardLabel: "03 / Coming soon",
    subtitle: "New project — details soon",
    comingSoon: true,
  },
  {
    slug: "coming-soon-3",
    cardLabel: "04 / Coming soon",
    subtitle: "New project — details soon",
    comingSoon: true,
  },
];
