import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Expense Manager",
  description: "Track, analyze, and save smarter with a premium local-first expense dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
