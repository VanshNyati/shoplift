import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Providers from "./Providers";

export const metadata: Metadata = {
  title: "Shoplift",
  description: "Catalogue + Cart built with Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-gray-50/60 antialiased">
        <Providers>
          <Header />
          <main className="container max-w-6xl py-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
