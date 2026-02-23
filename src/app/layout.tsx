import type { Metadata } from "next";
import { Inter, Playfair_Display, Amiri } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { LayoutManager } from "@/components/layout/LayoutManager";

// Font configurations
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic", "latin"],
  variable: "--font-amiri",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Ummah Thoughts - Islamic Knowledge Platform",
    template: "%s | Ummah Thoughts",
  },
  description: "A comprehensive platform for Islamic knowledge, featuring scholarly references, daily wisdom, and educational resources.",
  keywords: ["Islam", "Islamic knowledge", "Quran", "Sunnah", "Islamic education", "Ummah"],
  authors: [{ name: "Ummah Thoughts Team" }],
  creator: "Ummah Thoughts",
  publisher: "Ummah Thoughts",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Ummah Thoughts - Islamic Knowledge Platform",
    description: "A comprehensive platform for Islamic knowledge, featuring scholarly references, daily wisdom, and educational resources.",
    url: "/",
    siteName: "Ummah Thoughts",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ummah Thoughts",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ummah Thoughts - Islamic Knowledge Platform",
    description: "A comprehensive platform for Islamic knowledge, featuring scholarly references, daily wisdom, and educational resources.",
    images: ["/og-image.jpg"],
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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${inter.variable} ${playfair.variable} ${amiri.variable}`}
    >
      <body className="min-h-screen bg-background font-body antialiased">
        {/* Skip to main content — WCAG 2.4.1 Bypass Blocks */}
        <a href="#main-content" className="skip-nav">
          Skip to main content
        </a>
        <Providers>
          <LayoutManager>
            {children}
          </LayoutManager>
        </Providers>
      </body>
    </html>
  );
}
