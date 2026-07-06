import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QED Online",
  description: "Zusätzliche digitale Medien zur QED Schülerzeitung",
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
