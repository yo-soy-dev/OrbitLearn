
import type { Metadata } from "next";
import {
  ClerkProvider,
} from '@clerk/nextjs'
import { Geist, Geist_Mono } from "next/font/google";
// import { ThemeProvider } from "next-themes";
import "./globals.css";
import Navbar from "@/components/Navbar";
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
  title: "OrbitLearn",
  description: "AI-Powered or Futuristic Learning Ecosystem: → 🚀 OrbitLearn",
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
        {/* <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}> */}
        <ClerkProvider appearance={{ variables: { colorPrimary: '#00FF00' } }}>
          <Navbar />
          {children}
        </ClerkProvider>
        <Footer />
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
