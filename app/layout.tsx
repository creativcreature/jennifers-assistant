import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import Header from "@/components/layout/Header";
import OfflineIndicator from "@/components/layout/OfflineIndicator";

export const metadata: Metadata = {
  title: "Jennifer's Assistant",
  description: "Your personal life assistant - here to help with benefits, housing, food, and daily life.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Jennifer's Assistant",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#A71930",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="flex flex-col min-h-screen bg-bg-dark">
        <OfflineIndicator />
        <Header />
        <main className="flex-1 overflow-auto pb-20">
          {children}
        </main>
        <Navigation />
      </body>
    </html>
  );
}
