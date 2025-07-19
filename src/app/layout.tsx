import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ai-navigation-site.vercel.app'),
  title: "AI导航站 - 发现最好用的AI工具",
  description: "精心筛选的AI工具集合，提升你的工作效率，释放创造力。包含AI写作、绘画、视频、代码等各类工具。",
  keywords: "AI工具,人工智能,AI导航,ChatGPT,Midjourney,AI写作,AI绘画,机器学习,深度学习",
  authors: [{ name: "AI导航站团队" }],
  robots: "index, follow",
  openGraph: {
    title: "AI导航站 - 发现最好用的AI工具",
    description: "精心筛选的AI工具集合，提升你的工作效率，释放创造力",
    url: "https://ai-navigation-site.vercel.app",
    siteName: "AI导航站",
    locale: "zh_CN",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI导航站 - 发现最好用的AI工具",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI导航站 - 发现最好用的AI工具",
    description: "精心筛选的AI工具集合，提升你的工作效率，释放创造力",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://ai-navigation-site.vercel.app",
  },
  category: "technology",
};

export function generateViewport() {
  return {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "#ffffff" },
      { media: "(prefers-color-scheme: dark)", color: "#000000" },
    ],
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
