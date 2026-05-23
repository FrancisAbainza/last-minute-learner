// components/NavBar.tsx
'use client'

import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { SignInButton, SignUpButton, UserButton, Show } from "@clerk/nextjs"
import Link from 'next/link'

export function NavBar() {
  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/">
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
          </Link>
          <div className="hidden items-center space-x-4 md:flex">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm">
                  Get Started
                </Button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>
        </div>
      </div>
    </nav>
  )
}