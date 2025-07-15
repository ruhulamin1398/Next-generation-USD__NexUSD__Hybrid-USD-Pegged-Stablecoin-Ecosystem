'use client'

import { Box, Center, Text } from '@chakra-ui/react'
import { NextPage } from 'next'

import { BackgroundGradient } from '#components/gradients/background-gradient'
import { PageTransition } from '#components/motion/page-transition'
import { Section } from '#components/section'

const Signup: NextPage = () => {
  return (
    <Section height="100vh" innerWidth="container.xl">
      <BackgroundGradient
        zIndex="-1"
        width={{ base: 'full', lg: '50%' }}
        left="auto"
        right="0"
        borderLeftWidth="1px"
        borderColor="gray.200"
        _dark={{
          borderColor: 'gray.700',
        }}
      />
      <PageTransition height="100%" display="flex" alignItems="center">
        <Center width="100%">
          <Box p={8} bg="white" rounded="lg" shadow="md">
            <Text fontSize="2xl" mb={4} textAlign="center">
              Signup Page
            </Text>
            <Text textAlign="center" color="gray.600">
              Signup functionality temporarily disabled for build
            </Text>
          </Box>
        </Center>
      </PageTransition>
    </Section>
  )
}

export default Signup
