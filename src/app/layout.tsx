import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { ClerkProvider, SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { dark } from "@clerk/themes"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "LastMinuteLearner - AI Study Companion",
  description: "Transform any content into personalized study materials with AI",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#69b7dc",
          colorBackground: "#0a0a0a",
          colorInputBackground: "#1a1a1a",
          colorInputText: "#ffffff",
        },
        elements: {
          modalContent: "bg-background border border-border",
          card: "bg-background border border-border",
          headerTitle: "text-foreground",
          headerSubtitle: "text-muted-foreground",
          socialButtonsBlockButton: "bg-background border border-border text-foreground hover:bg-muted",
          formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
          footerActionLink: "text-primary hover:text-primary/80",
        },
      }}
    >
      <html lang="en" className="dark">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {/* Navigation */}
          <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 py-2 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <Image
                    src="/images/logo.png"
                    alt="Owl with a graduation hat"
                    width={50}
                    height={50}
                    className="w-12 h-12"
                    priority
                  />
                  <span className="ml-2 text-xl font-bold text-foreground">LastMinuteLearner</span>
                </div>
                <div className="hidden md:flex items-center space-x-4">
                  <SignedOut>
                    <SignInButton mode="modal">
                      <Button variant="outline" size="sm">
                        Sign In
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button size="sm">Get Started</Button>
                    </SignUpButton>
                  </SignedOut>
                  <SignedIn>
                    <UserButton
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: "w-8 h-8",
                        },
                      }}
                    />
                  </SignedIn>
                </div>
              </div>
            </div>
          </nav>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  )
}
