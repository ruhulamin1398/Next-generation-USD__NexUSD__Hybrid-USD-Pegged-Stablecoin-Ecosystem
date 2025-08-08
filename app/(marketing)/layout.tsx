import type { Metadata } from 'next'

import { MarketingLayout } from '#components/layout'

export const metadata: Metadata = {
  title: 'Next-generation USD -NexUSD',
  description:
    'Hybrid USD stablecoin bridging fiat & crypto with cross-chain, compliant, and yield features.',
}

export default function Layout(props: { children: React.ReactNode }) {
  return <MarketingLayout>{props.children}</MarketingLayout>
}
