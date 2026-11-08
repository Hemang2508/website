import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { DemoBar, Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/layout/Toaster";

export const metadata: Metadata = {
  title: { default: "RTG Live — Where Ideas Meet Influence", template: "%s · RTG Live" },
  description: "Discover creators and experts, book paid conversations and get structured creator feedback on your product.",
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = { themeColor: "#111C30", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <body className="min-h-screen">
        <StoreProvider>
          <DemoBar />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <Toaster />
        </StoreProvider>
      </body>
    </html>
  );
}
