import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "../SiteFooter";
import { CONTACT_URL } from "../site-config";

export const metadata: Metadata = {
  title: "About — Grid Noise Animator",
  description:
    "Who runs this site, how it relates to the original Grid Noise Animator tool, and how to get in touch.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <main className="page-shell">
        <Link className="home-link" href="/">
          ← Grid Noise Animator
        </Link>
        <h1>About this project</h1>

        <h2>What this site is</h2>
        <p>
          Grid Noise Animator is a free browser tool that turns a still image
          or a video into an animated grid of color noise, then exports the
          result as MP4, WebM, or GIF. Everything runs on your device. There is
          no upload step and no account.
        </p>

        <h2>Relationship to the original tool</h2>
        <p>
          This site did not invent the idea. The original Grid Noise Animator
          was released by a Japanese developer in June 2026 and spread quickly
          among illustrators who wanted a visible deterrent against automated
          image scraping. If you are looking for that tool, it lives at{" "}
          <a
            href="https://grid-noise-animator.vercel.app/"
            rel="noopener noreferrer"
          >
            grid-noise-animator.vercel.app
          </a>
          .
        </p>
        <p>
          This site is an independent implementation of the same concept. It
          was written from scratch, shares no code with the original, and is
          not affiliated with or endorsed by its author. We built it because we
          wanted a version we could document in English, maintain on a stable
          domain, and extend with guides that explain what the effect can and
          cannot do.
        </p>

        <h2>Who runs it and how it is funded</h2>
        <p>
          The site is run by an independent developer. It is free to use. The
          plan is to cover hosting costs with ads. Ads will stay away from the
          tool&apos;s controls, and the tool itself will keep working without
          any payment or sign-up.
        </p>

        <h2>Honesty about protection claims</h2>
        <p>
          The noise and overlay effects here add visible friction against
          casual scraping. They do not guarantee that an image can never be
          used for training.{" "}
          <Link href="/how-protection-works">
            How the protection overlays work
          </Link>{" "}
          spells out the mechanism and its limits.
        </p>

        <h2>Contact</h2>
        <p>
          Feedback, bug reports, and questions go through the{" "}
          <a href={CONTACT_URL}>project&apos;s public contact channel</a>.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
