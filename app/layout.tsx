import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://insightstube.com"),
  title: "InsightsTube — YouTube Transcript Generator & AI Video Summarizer",
  description:
    "Turn any YouTube video into text. Get the full transcript with timestamps, download subtitles as TXT, SRT or VTT, and read a one-click AI summary. Free, no signup.",
  keywords: [
    "youtube transcript",
    "youtube to text",
    "youtube transcript generator",
    "youtube video summarizer",
    "download youtube subtitles",
    "youtube captions download",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "InsightsTube — Turn any YouTube video into text & insights",
    description:
      "Full transcripts with timestamps, subtitle downloads and AI summaries for any YouTube video. Free, no signup.",
    url: "https://insightstube.com",
    siteName: "InsightsTube",
    type: "website",
  },
  robots: { index: true, follow: true },
  verification: { google: "DZu-RDa_U5KGH118lVuU_kgEBVrgMT1hvdN249St-qw" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "InsightsTube",
  url: "https://insightstube.com",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Free YouTube transcript generator and AI video summarizer. Get transcripts with timestamps, download subtitles, and summarize videos with AI.",
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
