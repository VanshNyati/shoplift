import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
// @ts-expect-error Devtools types optional
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const metadata: Metadata = {
  title: "Shoplift",
  description: "Catalogue + Cart built with Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-gray-50/60 antialiased">
        <QueryClientProvider client={queryClient}>
          <Header />
          <main className="container max-w-6xl py-6">{children}</main>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}
