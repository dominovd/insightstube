import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { getTopic, topics, type TopicChannel } from "@/lib/topics";
import { getLatestVideos, type ChannelVideo } from "@/lib/channel";

export const revalidate = 86400; // refresh latest videos daily

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

function fmtDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
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
    topic.channels.map(async (c) => ({
      ...c,
      videos: await getLatestVideos(c.handle),
    }))
  );

  const updated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        name: topic.h1,
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

        <section className="topic-channels">
          {channels.map((c) => (
            <ChannelCard key={c.handle} channel={c} />
          ))}
        </section>

        <section className="topic-method">
          <h2>How we picked these channels</h2>
          <p>{topic.methodology}</p>
        </section>

        <section className="topic-faq">
          <h2>Frequently asked questions</h2>
          {topic.faq.map((f, i) => (
            <div className="topic-faq-item" key={i}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

function ChannelCard({ channel }: { channel: TopicChannel & { videos: ChannelVideo[] } }) {
  return (
    <article className="ch-card">
      <div className="ch-main">
        <div className="ch-meta">
          <a
            className="ch-name"
            href={`https://www.youtube.com/@${channel.handle}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {channel.name}
          </a>
          <div className="ch-chips">
            <span className="ch-chip">{channel.level}</span>
            <span className="ch-chip">{channel.format}</span>
          </div>
          <p className="ch-best">{channel.bestFor}</p>
        </div>
      </div>

      {channel.videos.length > 0 && (
        <div className="ch-videos">
          <div className="ch-videos-label">Latest videos</div>
          {channel.videos.map((v) => (
            <div className="ch-video" key={v.videoId}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={v.thumbnail} alt="" loading="lazy" width={120} height={68} />
              <div className="ch-video-body">
                <div className="ch-video-title">{v.title}</div>
                {v.published && <div className="ch-video-date">{fmtDate(v.published)}</div>}
                <Link className="ch-video-cta" href={`/?v=${v.videoId}`}>
                  Get transcript &amp; insights →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
