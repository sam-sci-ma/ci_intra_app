import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SCI Staff Intranet",
  description:
    "Intranet portal for School of Collective Intelligence staff - Events, Communications & Admissions management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <body
    suppressHydrationWarning
    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
  >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
