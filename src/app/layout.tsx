import type { Metadata } from "next";
import { M_PLUS_1p } from "next/font/google";
import "./globals.css";

const mplus = M_PLUS_1p({
  weight: ['400', '500', '700'],
  subsets: ["latin"],
  variable: "--font-mplus",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "クリプレこうかんや | Holiday Gift Exchanger",
  description: "ホリデーシーズンのプレゼント交換をもっと楽しく！想いを伝えられる新しいプレゼント交換アプリ。自分のプレゼントが自分に当たらない仕組みで、みんなで楽しいひとときを。",
  keywords: ["プレゼント交換", "ギフト交換", "クリスマス", "ホリデー", "パーティー", "イベント"],
  authors: [{ name: "Holiday Gift Exchanger" }],
  creator: "Holiday Gift Exchanger",
  publisher: "Holiday Gift Exchanger",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  openGraph: {
    title: "クリプレこうかんや | Holiday Gift Exchanger",
    description: "ホリデーシーズンのプレゼント交換をもっと楽しく！想いを伝えられる新しいプレゼント交換アプリ。",
    url: "/",
    siteName: "Holiday Gift Exchanger",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Holiday Gift Exchanger Logo",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "クリプレこうかんや | Holiday Gift Exchanger",
    description: "ホリデーシーズンのプレゼント交換をもっと楽しく！想いを伝えられる新しいプレゼント交換アプリ。",
    images: ["/images/logo.png"],
    creator: "@your_twitter_handle", // 実際のTwitterハンドルに変更してください
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#C41E3A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
      </head>
      <body
        className={`${mplus.variable} antialiased`}
        style={{ fontFamily: 'var(--font-mplus), sans-serif' }}
      >
        {children}
      </body>
    </html>
  );
}
