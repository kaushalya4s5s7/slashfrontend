import type { Metadata } from "next";
import { Geist, Geist_Mono, Urbanist } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { AppNav } from "@/shared/components/AppNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SlashMarket",
  description: "Non-custodial yield marketplace on Etherlink Shadownet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full bg-zinc-950 text-zinc-100">
        <Providers>
          <div className="flex h-screen min-h-0 flex-col overflow-hidden">
            <AppNav />
            <main className="w-full flex-1 min-h-0 overflow-hidden">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
