'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

type RedirectOnSignedInProps = {
  to?: string
}

export function RedirectOnSignedIn({ to = '/dashboard' }: RedirectOnSignedInProps) {
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace(to)
    }
  }, [isLoaded, isSignedIn, to, router])

  return null
}


