import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { TutorialPanel, TutorialProvider } from "@/components/TutorialPanel";
import { TutorialLayout } from "@/components/TutorialLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agent Studio - Build agents by doing",
  description: "A visual playground to design, run, and understand agentic AI systems safely.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TutorialProvider>
          <Header />
          <div className="flex pt-16">
            <TutorialPanel />
            <TutorialLayout>
              {children}
            </TutorialLayout>
          </div>
        </TutorialProvider>
      </body>
    </html>
  );
}

