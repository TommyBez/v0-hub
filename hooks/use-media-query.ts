'use client'

import { useEffect, useState } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const matchMedia = window.matchMedia(query)
    
    // Set initial value
    setMatches(matchMedia.matches)

    // Define the handler
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Add the event listener
    if (matchMedia.addEventListener) {
      matchMedia.addEventListener('change', handler)
    } else {
      // Fallback for older browsers
      matchMedia.addListener(handler)
    }

    // Clean up
    return () => {
      if (matchMedia.removeEventListener) {
        matchMedia.removeEventListener('change', handler)
      } else {
        // Fallback for older browsers
        matchMedia.removeListener(handler)
      }
    }
  }, [query])

  return matches
}

export function useIsMobile() {
  return useMediaQuery('(max-width: 640px)')
}