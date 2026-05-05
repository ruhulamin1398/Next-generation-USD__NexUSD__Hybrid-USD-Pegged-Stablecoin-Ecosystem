'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { GA_ID } from '../lib/ga'

const pageview = (url: string) => {
  if (typeof window === 'undefined' || !(window as any).gtag) return

  ;(window as any).gtag('config', GA_ID, {
    page_path: url,
    page_location: window.location.href,
  })
}

export default function GoogleAnalytics() {
  const pathname = usePathname()

  useEffect(() => {
    pageview(pathname)
  }, [pathname])

  return null
}
