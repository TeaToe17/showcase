import { ReactNode } from "react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "@/styles/globals.css";
import { AppWrapper } from "@/context";
import { Inter } from "next/font/google";
import type { Metadata } from "next"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export const metadata: Metadata = {
  title: "Jale – Buy. Sell. Flex.",
  description:
    "Level up your hustle 💼💸. From books to gadgets to whatever's in your bag – Jale is the go-to campus marketplace. Join with a referral & unlock exclusive perks 🔥🚀.",
  openGraph: {
    title: "Join Our Amazing Platform - Special Invitation",
    description: "Turn your unused books and materials into cash! Join now to sell anything you no longer need, earn from your shelf clutter, and even negotiate prices when money’s tight. You’ve been personally invited – don’t miss out on this chance to make and save money!",
    images: [
      {
        url: "https://jale.vercel.app/jalecover.jpg",
        width: 1200,
        height: 630,
        alt: "Join Our Platform - Buy. Sell. Negotiate. Flex.",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Join Our Amazing Platform - Buy. Sell. Negotiate. Flex.",
    description: "Turn your unused books and materials into cash! Join now to sell anything you no longer need, earn from your shelf clutter, and even negotiate prices when money’s tight. You’ve been personally invited – don’t miss out on this chance to make and save money!",
    images: ["https://jale.vercel.app/jalecover.jpg"],
  },
}

const inter = Inter({ subsets: ["latin"] });

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => (
  <html lang="en">
    <head>
      <link
        href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
    </head>
    <body className={`${inter.className} font-urbanist`}>
      <AppWrapper>
        <ToastContainer />
        <Navbar />
        {children}
        <Footer />
      </AppWrapper>
    </body>
  </html>
);

export default RootLayout;
