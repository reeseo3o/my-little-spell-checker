import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  metadataBase: new URL('https://my-little-spell-checker.vercel.app'),
  title: "한국어 맞춤법 검사기",
  description: "한국어 맞춤법 검사 서비스",
  keywords: "맞춤법, 한국어, 검사기, 교정",
  robots: "index, follow",
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180' },
    ],
  },
  openGraph: {
    title: "한국어 맞춤법 검사기",
    description: "한국어 맞춤법 검사 서비스",
    url: "https://my-little-spell-checker.vercel.app",
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    siteName: "한국어 맞춤법 검사기",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
