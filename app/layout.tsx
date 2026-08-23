import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/nav/header";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import { BackToTop } from "@/components/back-to-top";
import { Toaster } from "@/components/ui/toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://teu-dominio.vercel.app"),
  title: {
    default: "David7279",
    template: "%s · David7279",
  },
  description:
    "Pensamentos, side projects e anotações sobre tecnologia e criação.",
  keywords: [
    "blog",
    "tecnologia",
    "side projects",
    "desenvolvimento",
    "next.js",
  ],
  authors: [{ name: "David7279", url: "https://teu-dominio.vercel.app" }],
  creator: "David7279",
  publisher: "David7279",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_PT",
    url: "https://teu-dominio.vercel.app",
    siteName: "David7279",
    title: "David7279",
    description:
      "Pensamentos, side projects e anotações sobre tecnologia e criação.",
    // images: [        // descomenta quando tiveres uma imagem
    //   {
    //     url: "/og.png",
    //     width: 1200,
    //     height: 630,
    //     alt: "David7279",
    //   },
    // ],
  },
  twitter: {
    card: "summary_large_image",
    title: "David7279",
    description:
      "Pensamentos, side projects e anotações sobre tecnologia e criação.",
    // images: ["/og.png"],
    // creator: "@teu_twitter",
  },
  alternates: {
    canonical: "https://teu-dominio.vercel.app",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt"
      className={cn(
        "antialiased",
        inter.variable,
        geistMono.variable,
        "font-sans",
      )}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <SmoothScrollProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="mx-auto w-full max-w-3xl px-6 py-20">
              {children}
            </main>
            <Toaster />
            <BackToTop />
          </ThemeProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
