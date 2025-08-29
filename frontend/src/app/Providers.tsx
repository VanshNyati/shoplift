"use client";

import { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import dynamic from "next/dynamic";

// lazy-load devtools on client, disabled on SSR
const ReactQueryDevtools = dynamic(
  () => import("@tanstack/react-query-devtools").then(m => m.ReactQueryDevtools),
  { ssr: false }
);

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV !== "production" ? (
        <ReactQueryDevtools initialIsOpen={false} />
      ) : null}
    </QueryClientProvider>
  );
}
