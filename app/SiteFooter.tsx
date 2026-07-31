import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>
        Independent browser implementation, not affiliated with the original
        Grid Noise Animator. See <Link href="/about">About</Link>.
      </p>
      <nav aria-label="Footer">
        <Link href="/#how-it-works">How it works</Link>
        <Link href="/#faq">FAQ</Link>
        <Link href="/guide">Guide</Link>
        <Link href="/export-formats">Export formats</Link>
        <Link href="/how-protection-works">Protection limits</Link>
        <Link href="/about">About</Link>
        <Link href="/privacy">Privacy</Link>
      </nav>
    </footer>
  );
}
