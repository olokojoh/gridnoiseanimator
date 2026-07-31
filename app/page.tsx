import Link from "next/link";
import { GridNoiseAnimator } from "./GridNoiseAnimator";
import { SiteFooter } from "./SiteFooter";

const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Grid Noise Animator",
  url: "https://gridnoiseanimator.net/",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern browser with HTML Canvas support.",
  description:
    "Create animated grid noise and glitch effects from images or videos, then export MP4, WebM, or GIF locally in your browser.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Grid-based color noise animation",
    "Image and video input",
    "MP4, WebM, and GIF export",
    "Local browser processing",
    "Region masking",
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a grid noise animator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A grid noise animator divides an image or video into cells and changes the color or position of those cells over time to create an animated noise or glitch effect.",
      },
    },
    {
      "@type": "Question",
      name: "Are my images uploaded?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Media is processed locally in your browser and is not uploaded by this tool.",
      },
    },
    {
      "@type": "Question",
      name: "Does grid noise prevent AI training?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No browser effect can guarantee that an image will never be learned from. Grid noise and high-frequency overlays may add friction or act as a visible deterrent, but should not be treated as complete protection.",
      },
    },
    {
      "@type": "Question",
      name: "Which export format should I use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "MP4 is usually the most shareable, WebM is efficient on the web, and GIF works well for short looping clips. Available codecs depend on your browser.",
      },
    },
    {
      "@type": "Question",
      name: "Is this the original Grid Noise Animator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. This site is an independent, from-scratch implementation of the same idea. It shares no code with the original tool and is not affiliated with its author.",
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <main>
        <GridNoiseAnimator />

        <div className="seo-content">
          <section id="how-it-works" className="seo-intro">
            <p className="eyebrow">FREE · ONLINE · NO UPLOAD</p>
            <h2>Create animated grid noise in your browser</h2>
            <p>
              Grid Noise Animator turns a still image or video into a moving
              grid of subtle color and position changes. Load your media above,
              choose a grid size, tune the effect, preview it in real time, and
              export an MP4, WebM, or animated GIF. Everything runs on your
              device.
            </p>
          </section>

          <section className="steps" aria-label="How to use Grid Noise Animator">
            <div>
              <span>01</span>
              <h3>Load media</h3>
              <p>Choose an image or video, or drop it directly onto the tool.</p>
            </div>
            <div>
              <span>02</span>
              <h3>Shape the noise</h3>
              <p>
                Adjust grid density, color variance, blur, warp, detail, and
                the area where the effect is applied.
              </p>
            </div>
            <div>
              <span>03</span>
              <h3>Preview and export</h3>
              <p>
                Play the animation, set its frame rate and duration, then
                export the format you need.
              </p>
            </div>
          </section>

          <section id="features" className="feature-section">
            <div>
              <p className="eyebrow">CONTROLS THAT STAY OUT OF THE WAY</p>
              <h2>
                Built for both subtle protection and expressive glitch art
              </h2>
            </div>
            <div className="feature-grid">
              <article>
                <h3>White and blue noise</h3>
                <p>
                  Choose unpredictable white noise or a more evenly distributed
                  blue-noise-style pattern for smoother visual texture.
                </p>
              </article>
              <article>
                <h3>Local media processing</h3>
                <p>
                  Images, videos, audio, previews, and exports stay inside your
                  browser session.
                </p>
              </article>
              <article>
                <h3>Inside/outside region mask</h3>
                <p>
                  Draw a rectangular region and apply grid noise only inside
                  it, or protect everything around it.
                </p>
              </article>
              <article>
                <h3>Flexible export</h3>
                <p>
                  Create MP4 or WebM video in supported browsers, or encode an
                  animated GIF without sending files to a server.
                </p>
              </article>
            </div>
          </section>

          <section id="protection" className="honesty">
            <div>
              <p className="eyebrow">AN HONEST NOTE ON AI PROTECTION</p>
              <h2>Useful friction, not an absolute guarantee</h2>
            </div>
            <p>
              The overlay options tint each frame with a fine, fixed
              checkerboard pattern. Because the pattern does not change between
              frames, it survives frame averaging and adds pixel-level texture
              that casual scraping pipelines have to deal with. It is not
              adversarial noise tuned against any specific model, and resizing
              or heavy compression can weaken it. Treat it as one part of your
              publishing choices, not as a promise that training is impossible.{" "}
              <Link href="/how-protection-works">
                Read how the overlays work and where they stop helping
              </Link>
              .
            </p>
          </section>

          <section id="faq" className="faq">
            <p className="eyebrow">FAQ</p>
            <h2>Grid Noise Animator questions</h2>
            <details>
              <summary>What is a grid noise animator?</summary>
              <p>
                It divides media into cells and changes the hue, lightness,
                saturation, or position of those cells frame by frame to create
                a moving noise effect.
              </p>
            </details>
            <details>
              <summary>Are my images uploaded?</summary>
              <p>
                No. The tool uses browser APIs and Canvas. Your source media and
                export remain on your device.
              </p>
            </details>
            <details>
              <summary>Does grid noise prevent AI training?</summary>
              <p>
                It may add friction or work as a deterrent, but no visual effect
                can guarantee that an image will never be used or learned from.
              </p>
            </details>
            <details>
              <summary>Which export format should I use?</summary>
              <p>
                MP4 is usually the most shareable, WebM is efficient on the web,
                and GIF works well for short looping clips. Available codecs
                depend on your browser.
              </p>
            </details>
            <details>
              <summary>Is this the original Grid Noise Animator?</summary>
              <p>
                No. This site is an independent, from-scratch implementation of
                the same idea. It shares no code with the original tool and is
                not affiliated with its author. The{" "}
                <Link href="/about">About page</Link> explains the
                relationship.
              </p>
            </details>
          </section>
        </div>
      </main>

      <SiteFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webApplicationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
