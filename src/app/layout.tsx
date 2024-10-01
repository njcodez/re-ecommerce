"use client"
import "~/styles/globals.css";
import { Toaster } from "~/components/ui/toaster"
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import Header from "./_components/Header";
import { SessionProvider } from "next-auth/react";



export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
       <SessionProvider>
        <div className="">
        <Header />
        </div>
       </SessionProvider> 
        <TRPCReactProvider>{children}</TRPCReactProvider>
        <Toaster />

      </body>
    </html>
  );
}
