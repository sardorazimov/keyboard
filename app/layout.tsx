import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/provider/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "KeyType | Professional Typing Trainer",
    template: "%s | KeyType"
  },
  description: "Master your typing speed with KeyType. Real-time stats, global leaderboards, and developer-centric minimalist design.",
  keywords: ["typing test", "wpm trainer", "keyboard speed", "coding speed", "KeyType"],
  authors: [{ name: "Sardor Azimov" }],
  icons: {
    icon: [
    { url: "/logos.svg", sizes: "32x32", type: "image/svg+xml" },
    { url: "/logos.svg", sizes: "192x192", type: "i" },
    { url: "/logos.svg", sizes: "512x512", type: "image/png" },
  ],
    shortcut: "/logos.svg",
    apple: "/logos.svg",
  },
  openGraph: {
    title: "KeyType - Minimalist Typing Speed Trainer",
    description: "Compete with others and improve your typing accuracy.",
    url: "https://keytype.app", // Kendi alan adını buraya yaz
    siteName: "KeyType",
    images: [
      {
        url: "/og-image.png", // Paylaşıldığında görünecek büyük görsel (isteğe bağlı)
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KeyType",
    description: "Improve your typing speed and compete globally.",
    images: ["/og-image.png"],
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
         <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
      </body>
    </html>
  );
}
