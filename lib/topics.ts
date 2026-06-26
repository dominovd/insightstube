export interface TopicChannel {
  handle: string; // YouTube @handle without the @
  name: string;
  bestFor: string;
  skip: string; // honest "who should skip this" note
  level: string;
  format: string;
  // Optional hand-picked "start here" videos; if set, they override the auto top-by-views list.
  best?: { videoId: string; title: string }[];
}

export interface TopicFaq {
  q: string;
  a: string;
}

export interface TopicNeed {
  situation: string;
  channels: string;
  why: string;
}

export interface Topic {
  slug: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  intro: string;
  methodology: string;
  lastReviewed: string;
  needs: TopicNeed[];
  channels: TopicChannel[];
  faq: TopicFaq[];
}

export const topics: Record<string, Topic> = {
  "youtube-channels-for-startup-business-advice": {
    slug: "youtube-channels-for-startup-business-advice",
    h1: "Best YouTube Channels for Startup Business Advice",
    metaTitle: "Best YouTube Channels for Startup Business Advice (2026) | InsightsTube",
    metaDescription:
      "A curated list of the best YouTube channels for startup and business advice, from fundraising to bootstrapping, with each channel's top videos and one-click AI insights.",
    keywords: [
      "best youtube channels for startup business advice",
      "best startup youtube channels",
      "youtube channels for entrepreneurs",
      "startup fundraising youtube",
      "best business youtube channels for founders",
    ],
    intro:
      "Whether you are validating a first idea, raising a seed round, or scaling a bootstrapped business, the right YouTube channels can save you years of trial and error. Below is a hand-picked list of channels worth following, what each one is best for, who should skip it, and their top videos. Open any video to get a transcript, summary, and key takeaways in seconds, without leaving this page.",
    methodology:
      "We choose channels by practical usefulness over motivation, the founder/operator credibility of the people behind them, relevance to startups specifically, publishing consistency, and the quality of their examples and case studies. We avoid channels that are mostly hype.",
    lastReviewed: "June 2026",
    needs: [
      {
        situation: "Validating an idea",
        channels: "Y Combinator, Noah Kagan",
        why: "Customer discovery and getting your first users",
      },
      {
        situation: "Building a pitch deck",
        channels: "Slidebean, Y Combinator",
        why: "Fundraising, decks and startup finance",
      },
      {
        situation: "Bootstrapping a business",
        channels: "Alex Hormozi, Starter Story",
        why: "Offers, revenue and real case studies",
      },
      {
        situation: "Market and investor view",
        channels: "a16z, This Week in Startups",
        why: "Trends and how investors think",
      },
      {
        situation: "Finding startup ideas",
        channels: "Greg Isenberg, Y Combinator",
        why: "Idea generation and spotting opportunities",
      },
    ],
    channels: [
      {
        handle: "ycombinator",
        name: "Y Combinator",
        bestFor:
          "First-principles startup advice from the accelerator behind Airbnb, Stripe and Dropbox, including the full Startup School.",
        skip: "Skip if you want quick tactical hacks; YC leans conceptual and long-form.",
        level: "All stages",
        format: "Talks & Startup School",
      },
      {
        handle: "startups",
        name: "This Week in Startups",
        bestFor:
          "Staying current on startups and venture through candid interviews with founders and investors.",
        skip: "Skip if you want short, to-the-point lessons; episodes are long and news-driven.",
        level: "All stages",
        format: "Interviews & news",
      },
      {
        handle: "a16z",
        name: "a16z (Andreessen Horowitz)",
        bestFor:
          "Market strategy and big-picture thinking on technology and company building from a top venture firm.",
        skip: "Skip if you need step-by-step early validation; a16z is high-level, not how-to.",
        level: "Growth stage",
        format: "Talks & analysis",
      },
      {
        handle: "slidebean",
        name: "Slidebean",
        bestFor:
          "Pitch decks, startup finance and honest company teardowns that show why startups win or fail.",
        skip: "Skip the off-topic tech explainers; their value is in the startup teardowns and decks.",
        level: "Pre-seed to Series A",
        format: "Case studies",
      },
      {
        handle: "GregIsenberg",
        name: "Greg Isenberg",
        bestFor:
          "Generating internet business ideas and building communities, with practical interviews for indie founders.",
        skip: "Skip if you are raising venture capital; the focus is indie and bootstrapped internet businesses.",
        level: "Idea stage",
        format: "Ideas & interviews",
      },
      {
        handle: "AlexHormozi",
        name: "Alex Hormozi",
        bestFor:
          "Offers, sales and scaling a bootstrapped business through blunt, tactical breakdowns.",
        skip: "Skip if you need VC-backed SaaS strategy; the lens is bootstrapped sales and offers.",
        level: "Bootstrappers",
        format: "Tactical breakdowns",
      },
      {
        handle: "noahkagan",
        name: "Noah Kagan",
        bestFor:
          "Fast, action-first advice on validating ideas, launching, and early marketing.",
        skip: "Skip if you want frequent fresh uploads; the catalog is strong but no longer posts often.",
        level: "First-time founders",
        format: "How-to & challenges",
      },
      {
        handle: "StarterStory",
        name: "Starter Story",
        bestFor:
          "Real founder case studies with actual revenue numbers and the steps behind them.",
        skip: "Skip if you need deep frameworks; examples inspire but may not map 1:1 to venture startups.",
        level: "All stages",
        format: "Case studies",
      },
    ],
    faq: [
      {
        q: "What is the best YouTube channel for startup business advice?",
        a: "There is no single best channel; it depends on your stage. Y Combinator is the strongest all-round starting point, while Alex Hormozi suits bootstrappers and a16z suits founders who want a market and investor perspective.",
      },
      {
        q: "What should first-time founders watch first?",
        a: "Start with Y Combinator's Startup School and Noah Kagan. They cover the fundamentals of validating an idea, talking to users, and launching, without assuming prior experience.",
      },
      {
        q: "What is the best YouTube channel for startup fundraising?",
        a: "Slidebean is the most focused on pitch decks and startup finance, while Y Combinator and a16z explain how investors actually think, which helps you prepare to raise a round.",
      },
      {
        q: "Are these channels free to watch?",
        a: "Yes, every channel listed is free on YouTube. You can also open any video here to get a free transcript, summary, and key takeaways.",
      },
      {
        q: "How often is this list updated?",
        a: "The top and latest videos under each channel refresh automatically every week. The channel selection itself is reviewed by hand, most recently in June 2026.",
      },
    ],
  },
};

export function getTopic(slug: string): Topic | undefined {
  return topics[slug];
}
