export type Project = {
  slug: string;
  cardLabel: string;
  subtitle: string;
  comingSoon: boolean;
  href?: string;
  image?: string;
  tags?: string[];
};

// TODO(sylvia): replace with real tags per project.
const PLACEHOLDER_TAGS = ["Placeholder tag", "2026"];

export const projects: Project[] = [
  {
    slug: "halogrip",
    cardLabel: "01 / Robotaxi Emergency Steering",
    subtitle: "Emergency steering for autonomous vehicles",
    comingSoon: false,
    href: "/work/halogrip",
    image: "/home/projects/halogrip-cover.png",
    tags: PLACEHOLDER_TAGS,
  },
  {
    slug: "coming-soon-1",
    cardLabel: "02 / Maritime HMI Design",
    subtitle: "New project — details soon",
    comingSoon: true,
    image: "/home/projects/cstrider-project.jpg",
    tags: PLACEHOLDER_TAGS,
  },
  {
    slug: "coming-soon-2",
    cardLabel: "03 / Truck Sensory Design",
    subtitle: "New project — details soon",
    comingSoon: true,
    image: "/home/projects/volvo-truck.jpg",
    tags: PLACEHOLDER_TAGS,
  },
  {
    slug: "coming-soon-3",
    cardLabel: "04 / Maize Drying System",
    subtitle: "New project — details soon",
    comingSoon: true,
    image: "/home/projects/corn-hands.jpg",
    tags: PLACEHOLDER_TAGS,
  },
];
