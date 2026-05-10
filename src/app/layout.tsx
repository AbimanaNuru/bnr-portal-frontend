import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "../styles/globals.css";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MavoServices",
  description: "MavoServices Dashboard",
};

import { GlobalModal } from "@/src/design-system/components/modal/GlobalModal";

import { Toaster } from "sonner";
import { QueryProvider } from "@/src/core/api/query-provider";
import { AuthGate } from "@/src/features/auth/components/auth-gate";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${urbanist.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <QueryProvider>
          <AuthGate>
            {children}
          </AuthGate>
          <GlobalModal />
        </QueryProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
