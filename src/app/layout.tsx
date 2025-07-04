import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header, Footer, ToastProvider } from "@/components/ui";
import QueryProvider from "@/components/providers/QueryProvider";
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
  title: "강원찐농부 - 강원도에서 온 진짜 농산물",
  description: "청정 강원도 고성에서 정성스럽게 키운 신선한 농산물을 농장에서 직접 보내드립니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-br from-potato-50 to-white`}
      >
        <QueryProvider>
          <ToastProvider>
            <Header />
            <main>
              {children}
            </main>
            <Footer />
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
