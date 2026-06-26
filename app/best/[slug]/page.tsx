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
    keywords: topic.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: topic.metaTitle,
      description: topic.metaDescription,
      url,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: topic.metaTitle,
      description: topic.metaDescription,
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
      {
        "@type": "Article",
        headline: topic.h1,
        description: topic.metaDescription,
        url: pageUrl,
        dateModified: new Date().toISOString(),
        author: { "@type": "Organization", name: "InsightsTube", url: BASE },
        publisher: { "@id": `${BASE}/#org` },
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

        <section className="topic-needs" aria-label="Which channel should I watch?">
          <h2>Which channel should I watch?</h2>
          <div className="needs-tablewrap">
            <table className="needs-table">
              <thead>
                <tr>
                  <th>If you are…</th>
                  <th>Start with</th>
                  <th>Why</th>
                </tr>
              </thead>
              <tbody>
                {topic.needs.map((n, i) => (
                  <tr key={i}>
                    <td>{n.situation}</td>
                    <td>{n.channels}</td>
                    <td>{n.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <TopicInteractive channels={channels} />

        <section className="topic-method">
          <h2>How we picked these channels</h2>
          <p>{topic.methodology}</p>
          <p className="topic-method-note">
            Each channel&apos;s top and latest videos refresh automatically every week. The channel
            selection itself is reviewed and updated by hand, most recently in {topic.lastReviewed}.
            We drop channels that go inactive or drift away from startup topics.
          </p>
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
