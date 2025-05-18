import { ReactNode, useEffect } from "react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "@/styles/globals.css";
import { AppWrapper } from "@/context";
import { Inter } from "next/font/google"

export const metadata = {
  title: "Jale",
  description:
    "Buy and Sell fairly used and new Books and other educational materials, Unilag",
};

const inter = Inter({ subsets: ["latin"] })

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
          <Navbar />
          {children}
          <Footer/>
        </AppWrapper>
      </body>
    </html>
);

export default RootLayout;