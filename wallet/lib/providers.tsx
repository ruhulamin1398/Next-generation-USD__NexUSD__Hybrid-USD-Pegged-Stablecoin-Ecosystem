'use client'

import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectKitProvider } from 'connectkit'
import { wagmiConfig } from '@/lib/wagmi'
import { useState } from 'react'
import { ToastProvider } from '@/app/hooks/useToast'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <ConnectKitProvider>{children}</ConnectKitProvider>
        </ToastProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
