import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Privacy Policy — InsightsTube",
  description: "How InsightsTube handles your data: what we collect, what we don't, and why.",
  alternates: { canonical: "/privacy" },
};

export default function Privacy() {
  return (
    <>
      <SiteNav />
      <main className="page">
        <h1>Privacy Policy</h1>
        <p className="page-sub">Last updated: June 12, 2026</p>

        <p>
          InsightsTube (&quot;we&quot;, &quot;us&quot;) operates insightstube.com. This
          policy explains what data we process when you use the site and the tools on
          it. The short version: we don&apos;t require accounts, we don&apos;t build
          user profiles, and we don&apos;t sell data.
        </p>

        <h2>What we process</h2>
        <ul>
          <li>
            <b>Video URLs you submit.</b> When you request a transcript, the URL is
            used to fetch the public caption track from YouTube. Transcripts are
            generated on demand and are not stored on our servers.
          </li>
          <li>
            <b>AI summaries.</b> When you request a summary, the transcript text is
            sent to Anthropic&apos;s Claude API to generate it. We do not store the
            input or the output. Anthropic&apos;s handling of API data is described in
            their privacy policy.
          </li>
          <li>
            <b>Technical logs.</b> Our hosting provider (Vercel) keeps standard
            server logs (IP address, user agent, request time) for security and
            abuse prevention. We use them only for operating the service.
          </li>
        </ul>

        <h2>Cookies and advertising</h2>
        <p>
          We may display ads served by Google AdSense. Google and its partners may use
          cookies and similar technologies to serve ads based on your visits to this
          and other websites. You can opt out of personalized advertising at{" "}
          <a href="https://adssettings.google.com" rel="nofollow">Google Ads Settings</a>.
          Where required by law, you will be asked for consent before such cookies are
          set. We do not set tracking cookies of our own.
        </p>

        <h2>Analytics</h2>
        <p>
          We may use privacy-respecting, aggregate analytics to understand which tools
          are used. These statistics do not identify individual visitors.
        </p>

        <h2>Your rights</h2>
        <p>
          Since we don&apos;t maintain accounts or stored personal data, there is
          usually nothing for us to delete. If you believe we hold personal data about
          you, contact us at <a href="mailto:info@insightstube.com">info@insightstube.com</a>{" "}
          and we will respond in line with the GDPR, CCPA and similar regulations.
        </p>

        <h2>Children</h2>
        <p>The service is not directed at children under 13 and we do not knowingly collect their data.</p>

        <h2>Changes</h2>
        <p>
          We may update this policy as the service evolves. The date above always
          reflects the latest revision. Significant changes will be noted on this page.
        </p>

        <p>
          Questions? <a href="mailto:info@insightstube.com">info@insightstube.com</a>
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
