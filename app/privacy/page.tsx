import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "../SiteFooter";
import { CONTACT_URL } from "../site-config";

export const metadata: Metadata = {
  title: "Privacy Policy — Grid Noise Animator",
  description:
    "How Grid Noise Animator handles your media, what it stores in your browser, and how advertising cookies are used on this site.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <>
      <main className="page-shell">
        <Link className="home-link" href="/">
          ← Grid Noise Animator
        </Link>
        <h1>Privacy policy</h1>
        <p className="page-updated">Last updated: August 1, 2026</p>

        <h2>Your media stays on your device</h2>
        <p>
          Images, videos, and audio files you load into the tool are processed
          with your browser&apos;s Canvas and MediaRecorder APIs. They are not
          uploaded to this site or to any third party. Exports are encoded in
          the browser and saved straight to your downloads folder. If you close
          the tab, the media is gone.
        </p>

        <h2>What this site stores in your browser</h2>
        <p>
          The tool keeps one entry in your browser&apos;s local storage: the
          interface language you picked, under the key{" "}
          <code>grid-noise-language</code>. You can remove it at any time by
          clearing site data in your browser. There are no accounts, no sign-up
          forms, and no analytics scripts on this site.
        </p>

        <h2>Server logs</h2>
        <p>
          Like any website, the servers that deliver these pages see standard
          request data such as your IP address and browser type. This data is
          handled by the hosting infrastructure to serve pages and protect the
          site against abuse. We do not use it to identify or profile you.
        </p>

        <h2>Advertising</h2>
        <p>
          This site plans to cover its costs with ads served through Google
          AdSense. When ads run on this site, the following applies:
        </p>
        <ul>
          <li>
            Third-party vendors, including Google, use cookies to serve ads
            based on your prior visits to this website or other websites.
          </li>
          <li>
            Google&apos;s use of advertising cookies enables it and its
            partners to serve ads to you based on your visits to this site
            and/or other sites on the Internet.
          </li>
          <li>
            You can opt out of personalized advertising by visiting{" "}
            <a
              href="https://www.google.com/settings/ads"
              rel="noopener noreferrer"
            >
              Google Ads Settings
            </a>
            . You can opt out of some other third-party vendors&apos; use of
            cookies for personalized advertising at{" "}
            <a
              href="https://www.aboutads.info/choices/"
              rel="noopener noreferrer"
            >
              aboutads.info/choices
            </a>
            .
          </li>
          <li>
            Visitors in the European Economic Area, the United Kingdom, and
            Switzerland will be asked for consent through a certified consent
            management platform before any personalized ads load.
          </li>
        </ul>
        <p>
          If ad networks other than Google are added later, they will be listed
          on this page.
        </p>

        <h2>Changes and contact</h2>
        <p>
          Changes to this policy will be posted on this page with a new date.
          Questions about it can be raised through the{" "}
          <a href={CONTACT_URL}>project&apos;s public contact channel</a>.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
