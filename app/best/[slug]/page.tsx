import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import TopicInteractive from "@/components/TopicInteractive";
import { getTopic, topics } from "@/lib/topics";
import { getLatestVideos, getTopVideos, type ChannelVideo } from "@/lib/channel";

const BASE = "https://insightstube.com";

export const revalidate = 604800; // refresh latest videos weekly

export function generateStaticParams() {
  return Object.keys(topics).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) return {};
  const url = `/best/${topic.slug}`;
  return {
    title: topic.metaTitle,
    description: topic.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: topic.metaTitle,
      description: topic.metaDescription,
      url,
      type: "article",
    },
  };
}

export default async function BestChannelsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) notFound();

  const channels = await Promise.all(
    topic.channels.map(async (c) => {
      const [latest, autoBest] = await Promise.all([
        getLatestVideos(c.handle),
        c.best?.length ? Promise.resolve<ChannelVideo[]>([]) : getTopVideos(c.handle),
      ]);
      const best: ChannelVideo[] = c.best?.length
        ? c.best.map((b) => ({
            videoId: b.videoId,
            title: b.title,
            thumbnail: `https://i.ytimg.com/vi/${b.videoId}/mqdefault.jpg`,
          }))
        : autoBest;
      return { ...c, latest, best };
    })
  );

  const updated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const pageUrl = `${BASE}/best/${topic.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE },
          { "@type": "ListItem", position: 2, name: topic.h1, item: pageUrl },
        ],
      },
      {
        "@type": "ItemList",
        name: topic.h1,
        url: pageUrl,
        numberOfItems: topic.channels.length,
        itemListElement: topic.channels.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.name,
          url: `https://www.youtube.com/@${c.handle}`,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: topic.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <SiteNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="wrap topic">
        <header className="topic-head">
          <h1>{topic.h1}</h1>
          <p className="topic-intro">{topic.intro}</p>
          <p className="topic-updated">Updated {updated}</p>
        </header>

        <TopicInteractive channels={channels} />

        <section className="topic-method">
          <h2>How we picked these channels</h2>
          <p>{topic.methodology}</p>
        </section>

        <section className="topic-faq">
          <h2>Frequently asked questions</h2>
          {topic.faq.map((f, i) => (
            <details className="topic-faq-item" key={i}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
