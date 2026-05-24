import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from '@clerk/ui/themes'
import { Toaster } from "sonner";
import { NavBar } from "@/components/nav-bar";
import Providers from "./providers";

const roboto = Roboto({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "Last Minute Learner",
  description: "Transform any content into personalized study materials with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", roboto.variable, "font-sans")}>
      <body>
        <ClerkProvider
          appearance={{
            theme: dark,
          }}
        >
          <NavBar />
          <Providers>
            {children}
          </Providers>
          <Toaster />
        </ClerkProvider>
      </body>
    </html>
  );
}