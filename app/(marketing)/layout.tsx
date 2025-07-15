import type { Metadata } from 'next'

import { MarketingLayout } from '#components/layout'

export const metadata: Metadata = {
  title: 'Saas UI Landingspage',
  description: 'Free SaaS landingspage starter kit',
}

export default function Layout(props: { children: React.ReactNode }) {
  return <MarketingLayout>{props.children}</MarketingLayout>
}
