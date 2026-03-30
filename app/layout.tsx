import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bunbury AI Receptionist",
  description: "AI-powered receptionist for local businesses — answers calls, books jobs, follows up leads 24/7.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
