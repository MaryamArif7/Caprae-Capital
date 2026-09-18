import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LeadConnect",
  description: "Call or message a lead in one click.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
