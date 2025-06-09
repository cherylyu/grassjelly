import type { Metadata } from "next";
import type { Viewport } from 'next';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: '青埔樂活地圖 | Lohas in Qingpu',
  description: '探索青埔的綠意與活力',
  keywords: '青埔, 地圖, 商店, 公園, 生活, 樂活',
  authors: [{ name: 'Cheryl Yu' }],
  robots: 'noindex, nofollow',
  metadataBase: new URL('https://lohas-in-qingpu.vercel.app'),
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
    other: [
      { rel: 'manifest', url: '/site.webmanifest' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    url: 'https://lohas-in-qingpu.vercel.app',
    title: '青埔樂活地圖 | Lohas in Qingpu',
    description: '探索青埔的綠意與活力',
    siteName: '青埔樂活地圖',
    images: [
      {
        url: '/images/og-image.png',
        width: 1024,
        height: 768
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '青埔樂活地圖 | Lohas in Qingpu',
    description: '探索青埔的綠意與活力',
    images: ['/images/og-image.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
