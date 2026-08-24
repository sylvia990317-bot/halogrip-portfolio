import type { Metadata } from "next";
import "./globals.css";

const title = "HALOGRIP — Sylvia Xie";
const description = "A human-centered emergency steering system for autonomous vehicles. A UX, HMI, and industrial design case study by Sylvia Xie.";

export const metadata: Metadata = {
  metadataBase: new URL("https://halogrip-sylvia-xie.sylvia990317.chatgpt.site"),
  title,
  description,
  openGraph: { title, description, images: [{ url: "/media/hero.webp", width: 2100, height: 1181, alt: "HALOGRIP emergency steering device" }] },
  twitter: { card: "summary_large_image", title, description, images: ["/media/hero.webp"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
