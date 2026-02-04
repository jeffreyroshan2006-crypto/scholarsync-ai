import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ScholarSync - AI Academic Research Assistant",
  description: "Search and aggregate academic papers from arXiv, Semantic Scholar, Tavily, and WolframAlpha. Save your research and discover new papers with AI-powered search.",
  keywords: ["academic research", "papers", "arxiv", "semantic scholar", "tavily", "wolframalpha", "AI search"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
