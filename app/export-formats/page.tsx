import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "../SiteFooter";

export const metadata: Metadata = {
  title: "Export Formats and Troubleshooting — Grid Noise Animator",
  description:
    "MP4, WebM, and GIF export in Grid Noise Animator: browser support, quality trade-offs, and fixes for the most common export problems.",
  alternates: {
    canonical: "/export-formats",
  },
};

export default function ExportFormatsPage() {
  return (
    <>
      <main className="page-shell">
        <Link className="home-link" href="/">
          ← Grid Noise Animator
        </Link>
        <h1>Export formats and troubleshooting</h1>
        <p className="page-updated">
          All three formats are encoded inside your browser. Nothing is
          uploaded, which also means your browser decides which codecs are
          available.
        </p>

        <h2>The three formats</h2>
        <table>
          <thead>
            <tr>
              <th>Format</th>
              <th>How it is made</th>
              <th>Good for</th>
              <th>Limits</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>MP4 (H.264)</td>
              <td>
                MediaRecorder captures the canvas in real time at 8 Mbps
              </td>
              <td>Sharing in chat apps and social uploads</td>
              <td>
                Not every browser can record H.264; the tool tells you when
                yours cannot
              </td>
            </tr>
            <tr>
              <td>WebM (VP9)</td>
              <td>Same real-time capture with the VP9 codec</td>
              <td>Web embeds, smaller files at the same quality</td>
              <td>Some video editors and older devices reject WebM</td>
            </tr>
            <tr>
              <td>GIF</td>
              <td>
                Encoded frame by frame in the page with a 256-color palette
              </td>
              <td>Short loops that autoplay anywhere</td>
              <td>
                Capped at 30 fps, scaled to at most 720 px wide, and files grow
                quickly with duration
              </td>
            </tr>
          </tbody>
        </table>

        <h2>Export settings</h2>
        <p>
          Frame rate accepts 1 to 60 fps and duration accepts 1 to 120 seconds.
          MP4 and WebM record in real time, so a 10-second export takes about
          10 seconds. GIF encoding is not real time: each frame is drawn,
          quantized to 256 colors, and written one by one, with progress shown
          in the status line.
        </p>
        <p>
          For MP4 and WebM you can attach an audio file, which is looped for
          the length of the clip. GIF has no audio.
        </p>

        <h2>Common problems</h2>
        <h3>&quot;MP4 export is not supported in this browser.&quot;</h3>
        <p>
          Your browser cannot record H.264 through MediaRecorder. Switch the
          format to WebM, or run the export in a Chromium-based browser or
          Safari and try MP4 again.
        </p>
        <h3>The export button is grayed out</h3>
        <p>
          Load an image or video first. The button stays disabled until media
          is loaded, and while another export is running.
        </p>
        <h3>GIF encoding is slow</h3>
        <p>
          Encoding runs on your CPU, one frame at a time. Shorten the duration,
          lower the export frame rate, or use a smaller source image. A
          10-second GIF at 30 fps is 300 frames.
        </p>
        <h3>GIF colors look banded</h3>
        <p>
          GIF holds at most 256 colors per frame, so smooth gradients band.
          That is a format limit. Export WebM or MP4 when your source has
          gradients or photographic color.
        </p>
        <h3>There is a label in the corner of my export</h3>
        <p>
          That is the watermark toggle in the preview controls. Turn it off
          before exporting if you do not want the &quot;GRID NOISE&quot; stamp.
        </p>

        <h2>Which one should I pick?</h2>
        <p>
          MP4 if you plan to send the clip to someone or post it. WebM if it
          goes on a web page you control. GIF only when the clip is a few
          seconds long and has to loop without a video player. When in doubt,
          export MP4 and keep the source image so you can re-export later. Set
          up the effect itself with the <Link href="/guide">settings guide</Link>.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
