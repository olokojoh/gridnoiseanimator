import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "../SiteFooter";

export const metadata: Metadata = {
  title: "Settings Guide — Grid Noise Animator",
  description:
    "What every control in Grid Noise Animator does, with starting points for subtle texture on artwork and for heavy glitch effects.",
  alternates: {
    canonical: "/guide",
  },
};

export default function GuidePage() {
  return (
    <>
      <main className="page-shell">
        <Link className="home-link" href="/">
          ← Grid Noise Animator
        </Link>
        <h1>Settings guide</h1>
        <p className="page-updated">
          Every control below is described by what it actually does in the
          renderer, so you can predict the result before you export.
        </p>

        <h2>How a frame is built</h2>
        <p>
          The tool draws your media onto a canvas (media wider than 1280 px is
          scaled down to 1280 px), splits it into a square grid, and redraws
          each cell with its own small color shift. On top of that it can add
          per-cell blur, per-cell position warp, a detail pass, and one or two
          fixed overlay patterns. Each animation frame repeats this with fresh
          noise values.
        </p>

        <h2>Grid settings</h2>
        <h3>Grid size</h3>
        <p>
          16, 32, 64, or 128 cells per side. Fewer cells make large, blocky
          patches that read as glitch art. More cells make a finer shimmer
          that is easier to ignore at normal viewing distance.
        </p>
        <h3>Enhanced mode and variation interval</h3>
        <p>
          Enhanced mode changes when the noise re-rolls: instead of following
          the sync cycle, it re-rolls every N frames, where N is the variation
          interval (1 to 120). It also nudges each cell sideways by up to 8% of
          the cell width, which makes the motion feel less rigid.
        </p>
        <h3>Detail mode</h3>
        <p>
          Draws a contrast-boosted copy of the source over the grid in
          soft-light blend. Depth (1 to 30) raises the contrast boost, and edge
          strength (0 to 100%) controls how opaque the pass is. Use Reprocess
          to re-render the current frame after changing these while paused.
        </p>

        <h2>Effect settings</h2>
        <h3>Noise type</h3>
        <p>
          White noise gives every cell an independent random value, so bright
          and dark shifts can clump together. The blue option steps through an
          evenly spaced golden-ratio sequence instead, so the shifts spread
          more uniformly across the grid and look smoother at the same
          variance. The spacing is blue-noise style, not a formally verified
          blue-noise distribution.
        </p>
        <h3>Hue, lightness, and saturation variance</h3>
        <p>
          Each cell gets its own shift within the range you set: hue up to
          ±90°, lightness up to ±25%, saturation up to ±25%. Hue variance is
          the most visible on colorful sources. On near-monochrome sources,
          lightness variance does most of the work.
        </p>
        <h3>Sync cycle</h3>
        <p>
          How many frames a noise pattern is held before it re-rolls, from ×1
          (new pattern every frame) to ×12. Higher values read as a slower,
          steadier flicker and export smaller GIF files because fewer frames
          differ.
        </p>
        <h3>Blur and warp</h3>
        <p>
          Blur (1 to 10 px) softens each cell. Warp (1 to 20 px) offsets each
          cell from its true position by a random amount up to the value you
          set, which is what produces the torn, displaced look.
        </p>
        <h3>Overlays</h3>
        <p>
          The high-frequency overlay tiles the frame with a faint fixed
          checkerboard at about 3% opacity. Strong overlay draws the same
          pattern in soft-light blend at higher opacity; its intensity slider
          maps to roughly 4% to 14%. Both are fixed patterns that persist
          across frames.{" "}
          <Link href="/how-protection-works">
            What these overlays can and cannot do
          </Link>
          .
        </p>

        <h2>Region mask</h2>
        <p>
          Draw Region lets you drag a rectangle on the preview. Inside applies
          the effect only within the rectangle; Outside applies it everywhere
          else, which is useful for keeping a face or signature clean while the
          background animates.
        </p>

        <h2>Preview and meter</h2>
        <p>
          Preview FPS (1 to 180) only affects playback smoothness in the
          browser, not the export. The watermark toggle stamps a small
          &quot;GRID NOISE&quot; label in the bottom-right corner. The noise
          strength meter is a summary of your current slider settings, not a
          measured protection score.
        </p>

        <h2>Starting points</h2>
        <h3>Subtle texture on artwork</h3>
        <ul>
          <li>Grid size 64 or 128</li>
          <li>Hue ±10 to 20°, lightness ±3 to 6%, saturation ±5%</li>
          <li>Sync cycle ×2 or ×3</li>
          <li>Blur off or 1 px, warp off</li>
          <li>High-frequency overlay on</li>
        </ul>
        <h3>Heavy glitch clip</h3>
        <ul>
          <li>Grid size 16 or 32</li>
          <li>Hue ±60 to 90°, lightness ±15%</li>
          <li>Enhanced mode with a variation interval of 2 to 5 frames</li>
          <li>Warp 10 px or more, blur 2 to 4 px</li>
          <li>Detail mode with high edge strength for extra crunch</li>
        </ul>
        <p>
          For export settings and format trade-offs, see the{" "}
          <Link href="/export-formats">export formats page</Link>.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
