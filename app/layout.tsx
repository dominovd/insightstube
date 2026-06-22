import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://insightstube.com"),
  title: "Free YouTube Transcript Generator with AI Insights | InsightsTube",
  description:
    "Get a free YouTube transcript with timestamps, then turn the video into AI insights, summaries and key takeaways. Copy text or download TXT, SRT and VTT. No signup needed.",
  keywords: [
    "youtube transcript",
    "youtube to text",
    "youtube transcript generator",
    "youtube video summarizer",
    "download youtube subtitles",
    "youtube captions download",
    "youtube transcript for chatgpt",
    "chat with youtube transcript",
    "translate youtube transcript",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Free YouTube Transcript Generator with AI Insights",
    description:
      "Paste a YouTube link to get a clean transcript with timestamps, then turn the video into AI summaries, key takeaways and insights.",
    url: "https://insightstube.com",
    siteName: "InsightsTube",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free YouTube Transcript Generator with AI Insights",
    description:
      "Get YouTube transcripts with timestamps for free, then turn videos into summaries, key takeaways and AI insights.",
  },
  robots: { index: true, follow: true },
  verification: { google: "DZu-RDa_U5KGH118lVuU_kgEBVrgMT1hvdN249St-qw" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://insightstube.com/#org",
      name: "InsightsTube",
      url: "https://insightstube.com",
      logo: "https://insightstube.com/icon.svg",
      email: "info@insightstube.com",
      sameAs: ["https://seocheck.tools"],
    },
    {
      "@type": "WebSite",
      "@id": "https://insightstube.com/#website",
      name: "InsightsTube",
      url: "https://insightstube.com",
      publisher: { "@id": "https://insightstube.com/#org" },
    },
    {
      "@type": "WebApplication",
      name: "InsightsTube",
      url: "https://insightstube.com",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      publisher: { "@id": "https://insightstube.com/#org" },
      description:
        "Free YouTube transcript generator and AI video summarizer. Get transcripts with timestamps, download subtitles, and summarize videos with AI.",
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
