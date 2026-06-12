import Link from "next/link";
import { guides } from "@/lib/guides";
import { IconTranscript, IconSparkles, IconList } from "./Icons";

const icons = {
  transcript: IconTranscript,
  sparkles: IconSparkles,
  list: IconList,
};

export default function RelatedGuides({ current }: { current: string }) {
  const related = guides.filter((g) => g.slug !== current);
  return (
    <section style={{ padding: "8px 0 0" }}>
      <h2>Related guides</h2>
      <div className="guides" style={{ marginTop: 18 }}>
        {related.map((g) => {
          const Icon = icons[g.icon];
          return (
            <Link className="guide-card" href={`/guides/${g.slug}`} key={g.slug}>
              <div className={`guide-img ${g.gradient}`} style={{ height: 90 }}>
                <Icon size={30} />
              </div>
              <div className="guide-body">
                <div className="guide-tag">{g.tag}</div>
                <h3 style={{ fontSize: 15 }}>{g.title}</h3>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
