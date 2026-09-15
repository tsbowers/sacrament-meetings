import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import NavLinks from "@/components/NavLinks";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Willow Creek Ward | Sacrament Meeting Planner",
  description: "This week's sacrament meeting program and speaking assignments.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-zinc-50 font-sans dark:bg-black">
        <Header />
        <NavLinks />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
