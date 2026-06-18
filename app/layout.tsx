import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Engram — Long-term memory for AI agents",
  description:
    "Give your AI app a memory that knows what's currently true. Hybrid vector + knowledge graph with automatic supersession. One API call away.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen antialiased" style={{ background: "var(--bg)", color: "var(--text)" }}>
        {children}
      </body>
    </html>
  );
}
