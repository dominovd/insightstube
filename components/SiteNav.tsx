import Link from "next/link";
import { IconPlay } from "./Icons";

export default function SiteNav() {
  return (
    <nav className="site">
      <div className="wrap nav-inner">
        <Link className="logo" href="/">
          <span className="logo-mark">
            <IconPlay size={15} />
          </span>
          <span>
            Insights<b>Tube</b>
          </span>
        </Link>
        <div className="nav-links">
          <Link href="/#tools">Tools</Link>
          <Link href="/#how">How it works</Link>
          <Link href="/guides">Guides</Link>
          <Link href="/#faq">FAQ</Link>
        </div>
        <Link className="nav-cta" href="/#top">
          Get transcript
        </Link>
      </div>
    </nav>
  );
}
