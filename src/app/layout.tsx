import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource/instrument-serif/latin-400.css";
import "@fontsource/instrument-serif/latin-400-italic.css";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { DemoBar, Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/layout/Toaster";
import { HydrationGate } from "@/components/layout/HydrationGate";

export const metadata: Metadata = {
  title: { default: "RTG Live — Where Ideas Meet Influence", template: "%s · RTG Live" },
  description: "Discover creators and experts, book paid conversations and get structured creator feedback on your product.",
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = { themeColor: "#10172A", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <body className="min-h-screen">
        <StoreProvider>
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-xl focus:bg-white focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-ink focus:shadow-pop">Skip to content</a>
          <DemoBar />
          <Navbar />
          <main id="main"><HydrationGate>{children}</HydrationGate></main>
          <Footer />
          <Toaster />
        </StoreProvider>
      </body>
    </html>
  );
}
