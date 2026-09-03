/**
 * Post Harvest — all visible copy, with the provenance of every factual claim.
 *
 * Sources: docs/kenya-case-audit.md (claim table, §5) and docs/kenya-content-plan.md.
 * `p` numbers refer to PDF pages of references/kenya/full-booklet/BOOKLET final.pdf.
 *
 * Rules enforced here (see docs/kenya-content-plan.md):
 *  - no em dashes in visible strings
 *  - "maize" never "corn"
 *  - nothing is stated as a measured or validated result, because none exists
 */

/** Evidence class for a factual claim. `validated` is intentionally never used. */
export type Evidence =
  | "observation"
  | "interview"
  | "calculation"
  | "assumption"
  | "feedback"
  | "prototype";

export const EVIDENCE_LABEL: Record<Evidence, string> = {
  observation: "Observation",
  interview: "Interview",
  calculation: "Calculation",
  assumption: "Design assumption",
  feedback: "Concept feedback",
  prototype: "Prototype activity",
};

export const project = {
  title: "Post Harvest",
  headline: "Rethinking maize drying with farmers in Seme",
  subtitle: "A maize drying concept developed with farmers in Seme.",
  concept: "The Drying Tower",
};

/** Three groups, not a five-row resume table. All confirmed facts preserved. */
export const meta: [string, string][] = [
  ["Role", "Design research and concept development"],
  ["Team", "Four students. Two industrial design, two architecture."],
  ["Context", "Year 4, MSc Industrial Design Engineering, Chalmers. Reality Studio, April to June 2024."],
];

/** 02. Context */
export const context = {
  heading: "Where this happened",
  intro:
    "Reality Studio is a Chalmers field course run with partner universities and organisations in Kenya. Our team spent April and May 2024 in Seme, a rural farming sub-county north east of Lake Victoria.",
  body: [
    "Kenya loses up to 30 percent of its key cereals within six months of harvest. In Seme, maize is the crop most households depend on, for food and for income.",
    "Our team was assigned the problem of grain storage.",
  ],
  stat: {
    value: "122,000",
    label: "people in Seme sub-county, about 450 per square kilometre",
    cite: "City Population, 2019",
  },
  lossCite: "World Bank et al., 2011",
};

/** 03. Learning in the field */
export const field = {
  heading: "Learning in the field",
  intro:
    "Three visits over five weeks. Interviews began structured, then loosened as we learned what to ask.",
  apollo: "Apollo, a local handcraft and agriculture expert, introduced us to the community.",
  // TODO(sylvia): confirm this attribution. It appears in the current portfolio deck
  // (Desktop - 13.pdf) but not in the booklet. Open question B in the content plan.
  contribution: "Sylvia wrote the interview questions and ran the interviews.",
  /** One short human observation, used as narrative rather than method description. */
  documentation:
    "We once set the camera directly in front of a farmer. Her body language told us to move it back.",
  quote: {
    text:
      "During a great harvest season, I could produce one bag of beans, but I could only harvest a half bag in time.",
    attribution: "Theresa",
    page: 27,
  },
};

/** Participants. Names are Sylvia's confirmed canonical spellings (audit §4.2). */
export const participants: {
  name: string;
  slug: string;
  note: string;
  evidence: Evidence;
  page: number;
}[] = [
  {
    // Report p.16 gives Theresa her own biography, which the older booklet had misaligned.
    // Her difference comes from knowledge, which is exactly the section 04 finding.
    name: "Theresa",
    slug: "theresa",
    note: "Attends One Acre Fund meetings. She does not have the weevil and theft problems the others describe.",
    evidence: "observation",
    page: 16,
  },
  {
    name: "Christine",
    slug: "christine",
    note: "Fetches water from a lake an hour away.",
    evidence: "interview",
    page: 27,
  },
  {
    name: "Magarite",
    slug: "magarite",
    note: "Runs her farm largely by herself.",
    evidence: "interview",
    page: 17,
  },
  {
    name: "Jakob",
    slug: "jakob",
    note: "Ran out of safe space to store his harvest.",
    evidence: "interview",
    page: 26,
  },
  {
    name: "Philister",
    slug: "philister",
    note: "Narrow mud paths make the harvest hard to move.",
    evidence: "interview",
    page: 26,
  },
];

/** 04. Finding the focus */
export const focus = {
  heading: "Finding the focus",
  intro: "We were assigned grain storage. The research pointed somewhere else.",
  body: [
    "Storage looked like the primary issue at first. But a storage solution already existed in Seme. Most farmers were not using the bags as intended, based on a misunderstanding of how they worked. The gap was knowledge, not hardware.",
    "We also found the group was not uniform. Farmers who already had a storage room did not lack space. Designing another storage facility would have served only part of the group.",
    "So we tested the conclusion before committing to it. We carried a storage concept into the farmer evaluation anyway. The response confirmed what the research suggested, and we moved our focus to the drying process.",
  ],
  caption: "Drying is one stage of six. It is the stage where the harvest is most exposed.",
  stages: ["Prework", "Planting", "Waiting", "Harvest", "Drying", "Storage"],
  selected: 4,
};

/** 05. Defining the challenge */
export const challenge = {
  heading: "Defining the challenge",
  intro:
    "Maize is spread on a tarp on the ground to dry in the sun. It has to come back indoors every evening.",
  body: [
    "Farmers told us they carry roughly 15 kilograms at a time, using their hands and small utensils. A 400 kilogram harvest means dozens of trips out in the morning and back again at night, across several days of the harvest season.",
    "Rain arrives without warning. Chickens eat and contaminate the maize. Theft is a constant worry, and it is the reason the crop cannot simply be left out overnight.",
  ],
  prioritiesHeading: "What the design had to do",
  priorities: [
    { text: "Dry maize using heat and airflow.", origin: "Research", page: 31 },
    { text: "Protect the crop from rain, animals and theft while it dries.", origin: "Research", page: 31 },
    { text: "Handle a meaningful quantity in one batch.", origin: "Design target", page: 31 },
    { text: "Stay manageable for one person.", origin: "Design target", page: 31 },
    { text: "Suit local materials and construction methods.", origin: "Design target", page: 36 },
  ],
};

/** 06. Developing with farmers */
export const concepts = {
  heading: "Developing with farmers",
  /**
   * Part 1 opens on the photograph, so the copy is one line and deliberately does NOT
   * announce the winner. The comparison in Part 3 has to do that, or the section stops
   * being a decision and becomes an announcement followed by an illustration.
   */
  intro: "We took the concepts back to the farmers twice.",
  /**
   * The two evaluation rounds as structural markers under the photograph, not a
   * paragraph. This is where the first-round facts live (drying table preferred, the
   * requirement specification and the brainstorm that produced the solar concept).
   */
  rounds: [
    { n: "Round one", text: "Ideas shown to three farmers, each of us sketching in our own hand. They preferred a drying table." },
    { n: "Round two", text: "After a requirement specification and a final brainstorm, three concepts, all redrawn by one person." },
  ],
  /** The three sketches presented in the second round. Source: `Desktop - 14.pdf`. */
  options: [
    { name: "The drying table with a toolkit", slug: "table", selected: false },
    { name: "The drying tower", slug: "tower", selected: true },
    { name: "The drying box", slug: "box", selected: false },
  ],
  /**
   * Part 2. Sits between the photograph and the comparison because it is the reason the
   * comparison is trustworthy at all - a design decision, not a footnote. Held to ~40
   * words so it stays a hinge in the sequence rather than a third block of copy.
   */
  methodStep: "Method correction",
  methodHeading: "We changed the method before we asked again",
  method:
    "The first sketches came from different hands at different levels of finish, and the farmers knew who had drawn what. Before the second round one person redrew every concept in the same hand, so the farmers were judging ideas, not drawings.",
  /** Part 3. Names what actually happened, rather than a generic SELECTED badge. */
  selectedNote: "Strongest response in the second evaluation",
  conclusion: "The Drying Tower received the strongest response, so we developed it further.",
  /**
   * PARKED, deliberately not rendered in 06. The sentence was:
   *   "Farmer preference told us which concept was worth developing. It did not tell us
   *    whether the concept would work."
   * Section 06 now ends on a single conclusion line, and section 09 ("Not built, not
   * validated") already carries the validation caveat in full. Restore it here only if
   * 09 ever loses that group.
   */
};

/**
 * 07. The Drying Tower — Final Concept.
 *
 * DELIVERABLE HIERARCHY (confirmed by Sylvia, 2026-09-02, and the source of truth for
 * this section. See docs/kenya-case-audit.md Resolution log #12):
 *   1. Final concept ............ The Drying Tower
 *   2. Primary deliverable ...... a construction handbook made by the team
 *   3. Handbook's purpose ....... to guide farmers in building the tower locally
 *   4. Physically prototyped .... the metal solar collector only
 *   5. Not completed ............ the full tower, and any real build from the handbook
 *
 * The handbook is the actual design outcome, not a supporting document. Sources:
 * booklet p.36 and p.44, TOC p.3 (HANDBOOK, printed p.49), and Desktop - 11.pdf.
 * Do NOT add claims about local material sourcing, independence, affordability or
 * successful replication: none are supported. Use "build" or "construct", never "rebuild".
 */
export const finalConcept = {
  label: "Final Concept",
  heading: "The Drying Tower",
  /** Approved lead, used verbatim. */
  lead:
    "The project's final deliverable was a construction handbook designed to help farmers build the Drying Tower locally.",
  /** What the concept is, kept short: the handbook is the outcome, this is its subject. */
  body: [
    "Two parts. A black box collector heats air in the sun, and a pipe carries it into a shelved tower where the maize sits.",
    "The door locks, so the maize can stay outside while the farmer is away. That answers three problems farmers described: animals, rain and theft.",
  ],
  deliverable: {
    title: "The construction handbook",
    text: "A construction manual, the materials needed, the tools needed, and how to use it.",
    /** The handbook's own contents page, report p.54. */
    contents: ["Construction", "Materials", "Tools", "How to use"],
    evidence: "prototype" as Evidence,
    page: 54,
  },
  /**
   * The team's own words, from the handbook's opening page (report p.55). This is a
   * first-hand statement of status from inside the deliverable itself, which is why it
   * carries the honesty of this section better than any summary would.
   */
  handbookQuote: {
    text:
      "The principles work, but we are not sure how efficient they will be in this version. The prototype needs to be built and tested in real-world conditions.",
    attribution: "From the construction handbook",
    page: 55,
  },
  /** Short status here. Section 09 carries the full account. */
  status: {
    built: "We prototyped the metal solar collector and left it with a farmer.",
    notBuilt: "The full tower was not constructed, and the handbook was not tested through an actual build.",
    page: 44,
  },
  specs: [
    { label: "Shelves", value: "10, each 81 by 70 by 2.5 cm", evidence: "observation" as Evidence, page: 36 },
    { label: "Estimated design capacity", value: "approximately 100 kg", evidence: "calculation" as Evidence, page: 36 },
    { label: "Material", value: "metal, with alternatives noted in the handbook", evidence: "assumption" as Evidence, page: 36 },
  ],
};

/** 08. How it was intended to work */
export const mechanism = {
  heading: "How it was intended to work",
  intro: "The principle is that hot air rises. The design puts that to work in four steps.",
  steps: [
    {
      name: "Collect",
      text: "The black box sits angled toward the sun. Its inside is painted black to absorb as much heat as possible, and it warms the air inside it.",
    },
    {
      name: "Rise",
      text: "The air inlet sits low, near the ground, where the air is cooler and drier. Warmed air rises out of the collector and into the tower.",
    },
    {
      name: "Dry",
      text: "The rising air passes through the shelves. It is drier than the maize, so it should draw moisture out as it moves.",
    },
    {
      name: "Exit",
      text: "The air leaves through the chimney at the top. One low inlet and one high outlet is what makes the airflow work.",
    },
  ],
  handling: [
    ["Loading", "Pull the shelves out and spread the maize evenly."],
    ["Releasing a little", "Pull out one or a few shelves."],
    ["Releasing a lot", "Unplug the pipe, place a bag underneath, and pour the maize out of the base."],
  ] as [string, string][],
  quote: { text: "So in theory this should work, but there are a lot of variables.", attribution: "Project report, 2024", page: 35 },
};

/**
 * 09. Composed around ONE statement, not four parallel lists: the handbook and the
 * collector exist, the tower does not. Everything else in the section is subordinate to
 * that distinction, which is why the statement is split in two here — `claimSolid` is set
 * on the solid band beside the finished work, `claimOpen` opens the light block that
 * carries the unbuilt tower. The earlier four-state grouping gave every claim the same
 * visual weight, so the reader had to audit the section rather than read it.
 */
export const status = {
  heading: "What we completed, and what remained open",

  claimSolid: "We completed the construction handbook and the solar collector.",
  claimOpen: "The full tower remained unbuilt and untested.",

  completed: {
    label: "Completed",
    items: [
      { name: "Construction handbook", note: "Measurements, cut list, tools and assembly steps.", page: 44 },
      { name: "Metal solar collector", note: "Prototyped, and left with a farmer.", page: 44 },
    ],
  },

  /* Attached to the tower drawing rather than listed, each carrying its own evidence
     label. None of these were physically measured, and the wording must not imply that
     they were. `slug` positions the annotation against the drawing (see the CSS). */
  designed: {
    label: "Designed or calculated, not measured",
    claims: [
      { slug: "airflow", v: "Airflow and temperature", k: "Concept assumption", page: 35 },
      { slug: "shelves", v: "10 shelves", k: "Design specification", page: 36 },
      { slug: "capacity", v: "Approx. 100 kg", k: "Calculated capacity", page: 36 },
    ],
  },

  notValidated: {
    label: "Not validated",
    text: "The full tower was not constructed, and the handbook was not tested through a real build.",
    /* The missed season is the cause of that limitation, so it is stated with it rather
       than floated separately elsewhere in the section. */
    season: "We also missed the harvest season, so we could not establish a baseline or test drying performance under the intended conditions.",
  },

  nextStep: {
    label: "Next step",
    text: "Build the complete tower from the handbook, then test it during the harvest season.",
    page: 44,
  },

  openHeading: "Open questions",
  open: [
    "Does it create sufficient airflow and temperature?",
    "How much maize can it dry in practice?",
    "How does it perform against the existing drying method?",
  ],
};

/**
 * 10. Reflection. Sylvia's own account, restored from her portfolio deck
 * (`Desktop - 15.pdf`): communication barriers, misaligned workflows and risk of oversight.
 * The fourth, research timing, comes from booklet p.45 and is the one that explains why
 * section 09 has nothing to validate.
 */
export const reflection = {
  heading: "What I would do differently",
  intro:
    "This was my first cross-disciplinary collaboration, working with architecture students.",
  insights: [
    {
      what: "Communication barriers",
      detail:
        "We spent a long time simply grasping each other's domain language. I did learn some of the terminology architects use, but that knowledge has to be acquired over time. There is no quick shortcut.",
      next: "Build a shared vocabulary deliberately in the first week, rather than letting it accumulate by accident.",
    },
    {
      what: "Misaligned workflows",
      detail:
        "Each discipline followed a distinct process. With limited time, merging them proved difficult and led to confusion over responsibilities.",
      next: "Learn each other's workflows beforehand, and map every member's key steps on one simple timeline.",
    },
    {
      what: "Risk of oversight",
      detail:
        "Because we divided the work late, some of us focused on design while others wrote the report. Crucial details slipped through the cracks, and the outcome did not fully meet everyone's expectations.",
      next: "Hold regular check-ins and keep responsibilities overlapping rather than clean.",
    },
    {
      what: "The wrong time of year",
      detail:
        "Visiting outside the harvest season meant we never saw the process at its most stressful, and could not measure the method we were trying to improve.",
      next: "Treat the timing of field research as a design constraint, and plan what can and cannot be learned before travelling.",
    },
  ],
  takeaway: "The research is what holds up. The concept is honest about where it stops.",
};

/** Ordered section registry, drives the page and the progress rail. */
export const sections = [
  { n: "01", id: "hero", title: "Post Harvest" },
  { n: "02", id: "context", title: "Where this happened" },
  { n: "03", id: "field", title: "Learning in the field" },
  { n: "04", id: "focus", title: "Finding the focus" },
  { n: "05", id: "challenge", title: "Defining the challenge" },
  { n: "06", id: "concepts", title: "Developing with farmers" },
  { n: "07", id: "final-concept", title: "The Drying Tower" },
  { n: "08", id: "mechanism", title: "How it was intended to work" },
  { n: "09", id: "status", title: "What we completed, and what remained open" },
  { n: "10", id: "reflection", title: "What I would do differently" },
];
