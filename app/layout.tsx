import type { Metadata } from "next";
import "@/styles/globals.css";
import { PortfolioProvider } from "@/hooks/usePortfolio";
import Header from "@/components/layout/Header";
import PortfolioPanel from "@/components/portfolio/PortfolioPanel";

export const metadata: Metadata = {
  title: "VCPulse - Narrative Intelligence Dashboard",
  description: "Real-time venture capital intelligence from podcast narratives",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-warm-paper text-deep-ink">
        <PortfolioProvider>
          <Header />
          <main className="pt-16">
            {children}
          </main>
          <PortfolioPanel />
        </PortfolioProvider>
      </body>
    </html>
  );
}