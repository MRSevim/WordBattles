import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Wrapper from "@/utils/Wrapper";

const geistSans = Open_Sans({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WordBattles",
  description: "Test your vocabulary skills, Online scrabble game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} antialiased`}>
        <Wrapper>
          {children}
          <Analytics />
        </Wrapper>
      </body>
    </html>
  );
}
