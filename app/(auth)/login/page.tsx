'use client'

import { Box, Center, Text } from '@chakra-ui/react'
import { BackgroundGradient } from 'components/gradients/background-gradient'
import { PageTransition } from 'components/motion/page-transition'
import { Section } from 'components/section'
import { NextPage } from 'next'

const Login: NextPage = () => {
  return (
    <Section height="calc(100vh - 200px)" innerWidth="container.sm">
      <BackgroundGradient zIndex="-1" />

      <Center height="100%" pt="20">
        <PageTransition width="100%">
          <Box p={8} bg="white" rounded="lg" shadow="md">
            <Text fontSize="2xl" mb={4} textAlign="center">
              Login Page
            </Text>
            <Text textAlign="center" color="gray.600">
              Login functionality temporarily disabled for build
            </Text>
          </Box>
        </PageTransition>
      </Center>
    </Section>
  )
}

export default Login
