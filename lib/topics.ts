export interface TopicChannel {
  handle: string; // YouTube @handle without the @
  name: string;
  bestFor: string;
  level: string;
  format: string;
}

export interface TopicFaq {
  q: string;
  a: string;
}

export interface Topic {
  slug: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  methodology: string;
  channels: TopicChannel[];
  faq: TopicFaq[];
}

export const topics: Record<string, Topic> = {
  "youtube-channels-for-startup-business-advice": {
    slug: "youtube-channels-for-startup-business-advice",
    h1: "Best YouTube Channels for Startup Business Advice",
    metaTitle: "Best YouTube Channels for Startup Business Advice (2026) | InsightsTube",
    metaDescription:
      "A curated list of the best YouTube channels for startup and business advice, from fundraising to bootstrapping, with their latest videos and one-click AI insights.",
    intro:
      "Whether you are validating a first idea, raising a seed round, or scaling a bootstrapped business, the right YouTube channels can save you years of trial and error. Below is a hand-picked list of channels worth following, what each one is best for, and their latest uploads. Open any video to get a transcript, summary, and key takeaways in seconds.",
    methodology:
      "We choose channels by how relevant they are to founders, the track record and credibility of the people behind them, how consistently they publish, and whether the advice is practical rather than motivational filler. We review the list regularly, and the latest videos under each channel update automatically.",
    channels: [
      {
        handle: "ycombinator",
        name: "Y Combinator",
        bestFor:
          "First-principles startup advice from the accelerator behind Airbnb, Stripe and Dropbox, including the full Startup School.",
        level: "All stages",
        format: "Talks & Startup School",
      },
      {
        handle: "thisweekinstartups",
        name: "This Week in Startups",
        bestFor:
          "Staying current on startups and venture through candid interviews with founders and investors.",
        level: "All stages",
        format: "Interviews & news",
      },
      {
        handle: "a16z",
        name: "a16z (Andreessen Horowitz)",
        bestFor:
          "Market strategy and big-picture thinking on technology and company building from a top venture firm.",
        level: "Growth stage",
        format: "Talks & analysis",
      },
      {
        handle: "slidebean",
        name: "Slidebean",
        bestFor:
          "Pitch decks, startup finance and honest company teardowns that show why startups win or fail.",
        level: "Pre-seed to Series A",
        format: "Case studies",
      },
      {
        handle: "GregIsenberg",
        name: "Greg Isenberg",
        bestFor:
          "Generating internet business ideas and building communities, with practical interviews for indie founders.",
        level: "Idea stage",
        format: "Ideas & interviews",
      },
      {
        handle: "AlexHormozi",
        name: "Alex Hormozi",
        bestFor:
          "Offers, sales and scaling a bootstrapped business through blunt, tactical breakdowns.",
        level: "Bootstrappers",
        format: "Tactical breakdowns",
      },
      {
        handle: "noahkagan",
        name: "Noah Kagan",
        bestFor:
          "Fast, action-first advice on validating ideas, launching, and early marketing.",
        level: "First-time founders",
        format: "How-to & challenges",
      },
      {
        handle: "StarterStory",
        name: "Starter Story",
        bestFor:
          "Real founder case studies with actual revenue numbers and the steps behind them.",
        level: "All stages",
        format: "Case studies",
      },
    ],
    faq: [
      {
        q: "Which YouTube channel is best for first-time founders?",
        a: "Y Combinator's Startup School and Noah Kagan are the most beginner-friendly: they cover the fundamentals of validating an idea, talking to users, and launching, without assuming prior experience.",
      },
      {
        q: "Which channels are best for fundraising and pitch decks?",
        a: "Slidebean focuses on pitch decks and startup finance, while Y Combinator and a16z explain how investors actually think, which helps you prepare for raising a round.",
      },
      {
        q: "Are these channels free to watch?",
        a: "Yes, every channel listed is free on YouTube. You can also open any video here to get a free transcript, summary, and key takeaways.",
      },
      {
        q: "How often is this list updated?",
        a: "We review the channel selection regularly, and the latest videos shown under each channel refresh automatically, so the page stays current.",
      },
    ],
  },
};

export function getTopic(slug: string): Topic | undefined {
  return topics[slug];
}
