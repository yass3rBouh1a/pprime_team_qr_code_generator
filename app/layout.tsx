import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Teamix — Team Contact Manager",
  description: "Manage your team's contacts and generate QR code business cards",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen relative`}>
        <div className="fixed top-6 left-6 z-50 pointer-events-none">
          <img 
            src="/assets/Logo+slogan_Plan de travail 1 copie 2.png" 
            alt="P Prime Logo" 
            className="h-10 w-auto object-contain"
          />
        </div>
        {children}
      </body>
    </html>
  );
}
