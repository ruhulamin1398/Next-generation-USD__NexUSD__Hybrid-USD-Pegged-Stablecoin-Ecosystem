import {
  Avatar,
  Box,
  Card,
  Flex,
  Grid,
  IconButton,
  Tag,
  Text,
  VStack,
  Wrap,
  useClipboard,
} from '@chakra-ui/react'

import {
  Highlights,
  HighlightsItem,
  HighlightsTestimonialItem,
} from '#components/highlights'
import { Section } from '#components/section'
import { Em } from '#components/typography'

import BridgeListCard from './bridge-list-card'

const BridgeSection = () => {
  const { value, onCopy, hasCopied } = useClipboard('yarn add @saas-ui/react')

  return (
    <Section innerWidth="container.xl" position="relative" overflow="hidden">
      <Grid
        templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(3, 1fr)' }}
        gap={8}
        position="relative"
      >
        <BridgeListCard />
      </Grid>
    </Section>
  )
}

export default BridgeSection
