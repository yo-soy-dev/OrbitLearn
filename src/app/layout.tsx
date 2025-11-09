
import type { Metadata } from "next";
import {
  ClerkProvider,
} from '@clerk/nextjs'
import { Geist, Geist_Mono } from "next/font/google";
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider appearance={{ variables: { colorPrimary: '#FF0000' } }}>
          <Navbar />
          {children}
        {/* <ClientLayout>{children}</ClientLayout> */}
        </ClerkProvider>
        <Footer />
      </body>
    </html>
  );
}
