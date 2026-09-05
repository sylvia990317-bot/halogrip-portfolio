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
 *
 * VISUAL SALVAGE PASS (approved). Copy that a photograph, drawing or diagram already
 * proves has been cut and converted into captions and labels. What survives as prose is
 * here because no image carries it: numbers, quotes, decisions and qualifications.
 * 535 words across sections 02 to 10 is a ceiling, not a quota. Where a factual
 * qualification needs the words, it keeps them.
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
  subtitle: "A maize drying concept developed with farmers in Seme, western Kenya.",
  concept: "The Drying Tower",
};

/** Three groups, not a five-row resume table. All confirmed facts preserved. */
export const meta: [string, string][] = [
  ["Role", "Design research and concept development"],
  ["Team", "Four students. Two industrial design, two architecture."],
  ["Context", "Year 4, MSc Industrial Design Engineering, Chalmers. Reality Studio, April to June 2024."],
];

/**
 * 02. Context.
 *
 * The course description and the assignment sentence are both gone from here. The course
 * is a dateline; the assignment is an annotation on the lifecycle diagram in section 04,
 * where it does actual work against the finding. What is left is the place and two
 * numbers, because a photograph cannot carry a number.
 */
export const context = {
  heading: "Where this happened",
  dateline: "Seme, Siaya County, Kenya. April to May 2024.",
  lead:
    "Seme is a rural farming sub-county in western Kenya, on the north east shore of Lake Victoria. Maize is the crop most households depend on, for food and for income.",
  stats: [
    {
      value: "122,000",
      label: "people in Seme sub-county, about 450 per square kilometre",
      cite: "City Population, 2019",
    },
    {
      value: "up to 30%",
      label: "of Kenya's key cereals lost within six months of harvest",
      cite: "World Bank et al., 2011",
    },
  ],
  /** Captions carry what the paragraphs used to say. */
  captions: {
    locator: "Seme sits on the north east shore of the Winam Gulf, in Siaya County, western Kenya.",
    road: "The road into Seme.",
    roof: "Drying on a roof. The existing method puts the crop wherever the sun reaches.",
    planting: "Planting by hand, the start of the same year's harvest.",
  },
};

/**
 * 03. Learning in the field.
 *
 * Photography leads. The team walking in and sitting with farmers is the evidence of
 * field participation; the five portraits support it rather than replacing it. Only two
 * pieces of prose survive: Sylvia's own contribution, and the camera anecdote, which is
 * the one observation no picture in the set actually shows.
 */
export const field = {
  heading: "Learning in the field",
  lead: "Three visits over five weeks. Apollo, a local handcraft and agriculture expert, introduced us to the community.",
  // TODO(sylvia): confirm this attribution. It comes from the current portfolio deck
  // (Desktop - 15/13.pdf) in Sylvia's own words, but is not in the booklet. Open question B.
  contribution:
    "I wrote the interview questions and ran the interviews. My groupmates took notes.",
  /** One short human observation, used as narrative rather than method description. */
  documentation:
    "We once set the camera directly in front of a farmer. Her body language told us to move it back.",
  captions: {
    walking: "Walking in to a homestead in Seme with Apollo.",
    team: "Sitting with farmers. Interviews began structured, then loosened as we learned what to ask.",
    timeline: "Six dates from the booklet. The blue band is the field period.",
    portraits: "The five farmers who took part.",
  },
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
    note: "Attends One Acre Fund meetings. Does not have the weevil and theft problems the others describe.",
    evidence: "observation",
    page: 16,
  },
  { name: "Christine", slug: "christine", note: "Fetches water from a lake an hour away.", evidence: "interview", page: 27 },
  { name: "Magarite", slug: "magarite", note: "Runs her farm largely by herself.", evidence: "interview", page: 17 },
  { name: "Jakob", slug: "jakob", note: "Ran out of safe space to store his harvest.", evidence: "interview", page: 26 },
  { name: "Philister", slug: "philister", note: "Narrow mud paths make the harvest hard to move.", evidence: "interview", page: 26 },
];

/**
 * 04. Finding the focus.
 *
 * THE BAGS HAVE TO BE NAMED. The section's whole finding is that a working storage
 * product already existed and was being misused, so "the bags" cannot appear without an
 * antecedent. Sources: report p.15 (One Acre Fund supplies PICS bags), p.24 (they are
 * Purdue Improved Crop Storage bags, non-chemical, up to three years if handled
 * properly, and farmers wrongly believed they lost potency after a season or two) and
 * p.28 (Theresa followed the instructions and was the only one of the five without a
 * weevil problem). There is no photograph of a PICS bag anywhere in the package, so this
 * is carried in words rather than promised as an image.
 *
 * The storage concept taken into the first evaluation is real (report p.24: "We still
 * decided to provide one of the concepts for storage in idea evaluation with the
 * farmers, and the thought was confirmed") but no sketch of it survives either, so it is
 * phrased as a method check and never as something the reader is about to see.
 * TODO(sylvia): if a round-one storage sketch or a photo of a PICS bag exists, both
 * would turn this section from told into shown.
 */
export const focus = {
  heading: "Finding the focus",
  lead: "We were assigned grain storage. The research pointed somewhere else.",
  /** Named, because the finding depends on knowing what they are. */
  bags: {
    label: "The storage product that already existed",
    text: "One Acre Fund supplies farmers in Seme with PICS bags, airtight sacks that protect grain without chemicals and last about three years if they are used as instructed.",
    page: 15,
  },
  body: [
    "Most farmers believed the bags lost their potency after a season or two, so they were not using them as intended. Theresa followed the instructions, and she was the only one of the five without a weevil problem. The gap was knowledge, not hardware.",
    "The group was not uniform either: farmers who already had a storage room did not need another one. We still put a storage concept into the first farmer evaluation to test that conclusion, and the response confirmed it.",
  ],
  captions: {
    needs: "Needs from the interviews, sorted into what farmers said and what they did not. Booklet p.21.",
    cycle: "Drying is one stage of six, and the stage where the harvest is most exposed.",
  },
};

/**
 * 05. Defining the challenge.
 *
 * The four vignettes state the problem and the photograph proves one of them. The
 * requirement list, drawn blank, replaces the five-bullet priority list: requirements
 * read as a specification rather than as a paragraph. The only prose kept is the
 * carrying arithmetic, because it is a number.
 */
export const challenge = {
  heading: "Defining the challenge",
  lead: "Maize is spread on a tarp on the ground to dry in the sun, and has to come back indoors every evening.",
  /** The one paragraph an image cannot carry: quantities. */
  arithmetic:
    "Farmers told us they carry roughly 15 kilograms at a time. A 400 kilogram harvest means dozens of trips out each morning and back each night, across several days of the season.",
  arithmeticPage: 31,
  /** Two beats, each a single visual argument that fits one viewport. */
  beats: {
    threats: "What threatens maize while it dries",
    needs: "What the design needed to do",
  },
  /**
   * The 3 + 1 set. The first three are whole-scene threats that arrive at the tarp; the
   * fourth is drawn at kernel scale because it is already inside the grain.
   *
   * The scale change is now carried by the composition and the caption: the three sit in
   * one rail at one size, the weevil is a smaller inset below it. There is no
   * "SCALE BREAK" label, which read as an internal design note rather than page copy.
   */
  threatsLabel: "Four problems found",
  /* `w`/`h` are each drawing's true pixel size. They differ, because the originals were
     drawn freehand at different extents, so they must be declared per item: a shared
     placeholder ratio makes the layout size its columns from the images and overflow. */
  threats: [
    { slug: "chicken", name: "Chickens", note: "Eating and contaminating the crop", w: 1200, h: 761 },
    { slug: "theft", name: "Theft", note: "The reason it cannot be left out overnight", w: 1200, h: 981 },
    { slug: "rain", name: "Rain", note: "Arriving without warning", w: 1200, h: 1065 },
  ],
  weevil: {
    slug: "weevils", name: "Weevils", w: 1200, h: 867,
    /* Carries the scale change in words, so no label has to announce it. */
    note: "Drawn at the scale of a single kernel, because this one does not arrive at the tarp. It is already inside the grain, and a door that locks does not stop it.",
  },
  captions: {
    chickenPhoto: "Maize drying on a tarp in Seme, with the first of those four problems walking across it.",
    figures: "Carried by hand, and by wheelbarrow where the paths allow.",
    checklist: "Set before any concept work. Section 09 returns to this same list with the team's own marks.",
  },
};

/**
 * 06. Developing with farmers.
 *
 * Two states, in order. First the three concepts at equal weight, which is how the
 * farmers saw them. Only after the outcome line does the tower become dominant. The
 * legend declares the colour code that is already in all three drawings, which is what
 * makes them comparable, and it is the same code section 08 uses.
 */
export const concepts = {
  heading: "Developing with farmers",
  lead: "We took the concepts back to the farmers twice.",
  rounds: [
    { n: "Round one", text: "Ideas shown to three farmers, each of us sketching in our own hand. They preferred a drying table." },
    { n: "Round two", text: "Three concepts, all redrawn by one person, so the farmers judged ideas and not drawings." },
  ],
  evaluationLabel: "As the farmers saw them",
  options: [
    { name: "The drying table with a toolkit", slug: "table", selected: false },
    { name: "The drying tower", slug: "tower", selected: true },
    { name: "The drying box", slug: "box", selected: false },
  ],
  conclusion: "The Drying Tower received the strongest response, so we developed it further.",
  selectedNote: "Strongest response in the second evaluation",
  captions: {
    review: "A farmer reading one of the concept sketches, second evaluation round.",
    legend: "The same annotation code runs through all three sketches.",
  },
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
 * The handbook is the actual design outcome, not a supporting document, and holds the
 * dominant visual slot. Sources: booklet p.36 and p.44, TOC p.3 (HANDBOOK, printed p.49),
 * and Desktop - 11.pdf. Do NOT add claims about local material sourcing, independence,
 * affordability or successful replication: none are supported. Use "build" or
 * "construct", never "rebuild".
 */
export const finalConcept = {
  label: "Final Concept",
  heading: "The Drying Tower",
  /** Approved lead, used verbatim. */
  lead:
    "The project's final deliverable was a construction handbook designed to help farmers build the Drying Tower locally.",
  body: [
    "A black box collector heats air in the sun; a pipe carries it into a shelved tower. The door locks, so the crop can stay outside while the farmer is away.",
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
   * The team's own words, from the handbook's opening page (report p.55). A first-hand
   * statement of status from inside the deliverable itself.
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
  captions: {
    step: "One assembly step. Every joint is drawn, with the tubes it needs listed beneath it.",
    tower: "The tower the handbook guides people to build. It was never constructed.",
    cutlist: "The cut list. Every part is measured before anything is welded.",
  },
};

/**
 * 08. How it was intended to work.
 *
 * The two-state drawing carries the mechanism, so the four steps are labels on it rather
 * than four paragraphs. The ghosted frames carry the handling, so the three-row table is
 * gone. The report's own hedge stays as prose: it is the section's honesty valve.
 */
export const mechanism = {
  heading: "How it was intended to work",
  lead: "Hot air rises. The design puts that to work.",
  /** Four labels placed against the two frames, not four blocks of copy. */
  steps: [
    { n: "1", name: "Collect", text: "Black box absorbs sun, warms the air." },
    { n: "2", name: "Rise", text: "Inlet sits low, where air is cooler and drier." },
    { n: "3", name: "Dry", text: "Rising air passes the shelves, drawing moisture out." },
    { n: "4", name: "Exit", text: "Out through the chimney. One low inlet, one high outlet." },
  ],
  frameCaptions: { sun: "Capturing heat", airflow: "Creating airflow" },
  handling: [
    { name: "Loading", text: "Pull the shelves out, spread the maize." },
    { name: "Releasing", text: "Pull a shelf, or pour from the base." },
  ],
  handlingNote: "Ghosted body, inked action.",
  quote: { text: "So in theory this should work, but there are a lot of variables.", attribution: "Project report, 2024", page: 35 },
};

/**
 * 09. What we completed, and what remained open.
 *
 * The team's own marked requirement list is the primary visual. An unmarked box records
 * that the item was not assessed, which is all it can record: no tower was built and no
 * harvest season was observed. WORDING GUARDRAIL, approved: unmarked items are
 * "could not yet be evaluated", "not validated" or "still open", never "unmet" or
 * "failed". The interpretation of why they stayed open is a separate page caption, set
 * outside the drawing, so it can never read as the team's own annotation.
 */
export const status = {
  heading: "What we completed, and what remained open",

  claimSolid: "We completed the construction handbook and the solar collector.",
  claimOpen: "The full tower remained unbuilt and untested.",

  /* TODO(sylvia): replace with the real photograph of the built solar collector left
     with the farmer. Until it arrives the page shows a labelled placeholder rather than
     a broken image or a silent gap. */
  collectorPhoto: {
    pending: true,
    label: "Photograph to come",
    caption: "The metal solar collector, built and left with a farmer in Seme.",
  },
  completed: {
    label: "Completed",
    items: [
      { name: "Construction handbook", note: "Measurements, cut list, tools and assembly steps.", page: 44 },
      { name: "Metal solar collector", note: "Prototyped, and left with a farmer.", page: 44 },
    ],
  },

  /** Caption for the marked checklist. Deliberately outside the drawing. */
  checklist: {
    label: "The list, marked by the team",
    caption: "Thirteen of eighteen requirements marked. Five were left unmarked.",
    page: 38,
  },

  /** Approved decision 3: separate, clearly titled, and never in the team's voice. */
  whyOpen: {
    heading: "Why these remained open",
    text: "Each of the five compares the design against the traditional method, or against time. Both need a built tower and a season to run it in, so none could yet be evaluated.",
  },

  notValidated: {
    text: "The full tower was not constructed, and the handbook was not tested through a real build.",
    /* The missed season is the cause of that limitation, so it is stated with it. */
    season: "We also visited outside the harvest season, so we could not establish a baseline or test drying performance.",
  },

  nextStep: {
    label: "Next step",
    text: "Build the complete tower from the handbook, then test it during the harvest season.",
    page: 44,
  },
};

/**
 * 10. Reflection. Sylvia's own account, restored from her portfolio deck
 * (`Desktop - 15.pdf`): communication barriers, misaligned workflows and risk of
 * oversight, condensed but not reworded into anything she did not write. The fourth,
 * research timing, comes from booklet p.45 and is the one that explains why section 09
 * has nothing to validate.
 *
 * Deliberately prose-led with no explanatory icons or diagrams. DSCF0457, the dusk
 * homestead, closes the page.
 */
export const reflection = {
  heading: "What I would do differently",
  lead: "This was my first cross-disciplinary collaboration, working with architecture students.",
  insights: [
    {
      what: "Communication barriers",
      detail:
        "We spent a long time grasping each other's domain language. I learned some of the terminology architects use, but that takes time.",
      next: "Build a shared vocabulary deliberately in the first week.",
    },
    {
      what: "Misaligned workflows",
      detail:
        "Each discipline followed a distinct process. With limited time, merging them proved difficult and led to confusion over responsibilities.",
      next: "Map every member's key steps on one timeline before starting.",
    },
    {
      what: "Risk of oversight",
      detail:
        "We divided the work late, so some of us designed while others wrote the report. Crucial details slipped through the cracks.",
      next: "Hold regular check-ins and keep responsibilities overlapping.",
    },
    {
      what: "The wrong time of year",
      detail:
        "Visiting outside the harvest season meant we never saw the process at its most stressful, or measured what we set out to improve.",
      next: "Treat the timing of field research as a design constraint.",
    },
  ],
  takeaway: "The research is what holds up. The concept is honest about where it stops.",
  closingCaption: "Dusk in Seme, at the end of a field day.",
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
