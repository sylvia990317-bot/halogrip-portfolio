import type { Metadata } from "next";
import { Inter_Tight, Inter, DM_Mono } from "next/font/google";
import "./globals.css";

const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-dm-mono" });

export const metadata: Metadata = {
  metadataBase: new URL("https://halogrip-portfolio.vercel.app"),
  title: "Sylvia Xie — Industrial Designer",
  description: "Portfolio of Sylvia Xie, an industrial designer based in Gothenburg, Sweden, working across digital and physical product design.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${interTight.variable} ${inter.variable} ${dmMono.variable}`}
    >
      <body className="bg-bg text-ink font-body antialiased">{children}</body>
    </html>
  );
}
