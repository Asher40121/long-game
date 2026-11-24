import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer, Header } from "@/components/AppShell";
import { StoreProvider } from "@/components/store";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Long Game · Relationship-first deal pipeline", template: "%s · Long Game" },
  description:
    "A relationship-first deal pipeline for corporate development teams: track founders over years, score fit against portfolio gaps, and brief leadership in one page. Demo with fictional data.",
};

// Applies the saved theme (or the system setting) before first paint, to avoid a flash.
const themeScript = `try{var t=localStorage.getItem("longgame:theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <StoreProvider>
          <Header />
          <main id="main" className="mx-auto w-full max-w-7xl flex-1 px-4 pt-6 sm:px-6">
            {children}
          </main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
