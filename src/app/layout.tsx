import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "길울림",
  description:
    "퇴근 후, 길 위에서 음악으로 이어지는 순간. 직장인 보컬 소모임 길울림.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "길울림",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#4a6741",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={geistSans.variable}>
      <body className="antialiased bg-white text-gray-900">
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
