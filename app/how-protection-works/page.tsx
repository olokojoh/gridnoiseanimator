import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "../SiteFooter";

export const metadata: Metadata = {
  title: "How the Protection Overlays Work — Grid Noise Animator",
  description:
    "What the high-frequency overlays in Grid Noise Animator actually do to your image, what they can deter, and where they stop helping.",
  alternates: {
    canonical: "/how-protection-works",
  },
};

export default function HowProtectionWorksPage() {
  return (
    <>
      <main className="page-shell">
        <Link className="home-link" href="/">
          ← Grid Noise Animator
        </Link>
        <h1>How the protection overlays work</h1>
        <p className="page-updated">
          This page describes the exact mechanism, because protection claims
          without a mechanism are marketing.
        </p>

        <h2>What is drawn on your image</h2>
        <p>
          Both overlay options tile the whole frame with the same 4×4 pixel
          checkerboard: two cells tinted blue, two tinted pink, alternating
          every 2 pixels. The standard high-frequency overlay draws it at about
          3% opacity in overlay blend. Strong overlay draws the same pattern in
          soft-light blend at higher opacity, with the intensity slider mapping
          to roughly 4% to 14%. The pattern is fixed: it does not move or
          change between frames.
        </p>
        <p>
          Separately, the grid noise itself shifts the hue, lightness, and
          saturation of every cell on every cycle. That part is animation, and
          it is also what makes single clean frames harder to pull out of the
          clip.
        </p>

        <h2>Why a fixed high-frequency pattern</h2>
        <p>
          A common way to clean noisy video is frame averaging: stack many
          frames and average them, so anything that changes from frame to frame
          cancels out. The per-frame grid noise disappears under that attack.
          The overlay does not, because it is identical in every frame. What
          survives averaging is your image plus a persistent 2-pixel
          checkerboard, which leaves visible texture in flat areas and adds
          pixel-level detail that automated pipelines have to filter before the
          image is clean.
        </p>

        <h2>What it does not do</h2>
        <ul>
          <li>
            It is not adversarial noise. Research tools such as Glaze and
            Nightshade compute perturbations against specific model families.
            This overlay is a fixed pattern with no model in the loop.
          </li>
          <li>
            It does not survive everything. Downscaling, blurring, or strong
            JPEG or video compression can weaken or fully remove a 2-pixel
            pattern.
          </li>
          <li>
            It does not prevent training. A pipeline that is willing to spend
            effort on your image can filter it. The honest claim is friction
            and a visible statement of intent, nothing stronger.
          </li>
        </ul>

        <h2>Check it yourself</h2>
        <ol>
          <li>Export a clip with Strong overlay at high intensity.</li>
          <li>
            Open the export and zoom to 400%. You should see the checkerboard
            in flat areas.
          </li>
          <li>
            Re-compress the clip (for example, upload it to a platform that
            re-encodes video) and zoom in again. If the pattern is gone after
            re-encoding, you know exactly how much protection survived your
            publishing path.
          </li>
        </ol>

        <h2>A note on the old &quot;Deep Protect&quot; name</h2>
        <p>
          Earlier builds of this tool kept the reference interface&apos;s
          &quot;Deep Protect&quot; label, along with epsilon and step sliders
          and a Prepare button. In this implementation those
          controls only ever changed the opacity of the fixed pattern described
          above, so the name and the extra controls overstated what was
          happening. The control is now a single intensity slider, and this
          page is the full description of what it does.
        </p>

        <p>
          Practical settings for combining the overlays with grid noise are in
          the <Link href="/guide">settings guide</Link>.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
