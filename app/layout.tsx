import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://gridnoiseanimator.net"),
  title: "Grid Noise Animator — Free Online Image Noise Animation Tool",
  description:
    "Create animated grid noise and glitch effects from images or videos. Preview and export MP4, WebM, or GIF locally in your browser—free and no upload.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Grid Noise Animator",
    title: "Grid Noise Animator — Free Online Noise Animation Tool",
    description:
      "Turn images and videos into animated grid noise. Free, private, and processed locally in your browser.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Grid Noise Animator — Animate images. Export locally.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Grid Noise Animator",
    description:
      "Create animated grid noise and export MP4, WebM, or GIF locally.",
    images: [
      {
        url: "/og.png",
        alt: "Grid Noise Animator — Animate images. Export locally.",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d0d0f",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>{children}</body>
    </html>
  );
}
