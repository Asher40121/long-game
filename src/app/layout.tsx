import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer, Header } from "@/components/AppShell";
import { StoreProvider } from "@/components/store";
import { StoryProvider } from "@/components/story/Story";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Long Game · Relationship-first deal pipeline", template: "%s · Long Game" },
  description:
    "A relationship-first deal pipeline for corporate development teams: track founders over years, score fit against portfolio gaps, and brief leadership in one page. Demo with fictional data.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // The demo always opens in dark mode; the header toggle switches to light for the rest of the visit.
  return (
    <html lang="en" suppressHydrationWarning className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <StoreProvider>
          <StoryProvider>
          <Header />
          <main id="main" className="mx-auto w-full max-w-7xl flex-1 px-4 pt-6 sm:px-6">
            {children}
          </main>
          <Footer />
          </StoryProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
