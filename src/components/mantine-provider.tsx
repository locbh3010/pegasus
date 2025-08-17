'use client'

import { MantineProvider, createTheme } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { ReactNode } from 'react'

// Import Mantine styles
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'

const theme = createTheme({
  /** Put your mantine theme override here */
  colorScheme: 'dark',
})

interface MantineProviderWrapperProps {
  children: ReactNode
}

export const MantineProviderWrapper = ({ children }: MantineProviderWrapperProps) => {
  return (
    <MantineProvider theme={theme}>
      <Notifications />
      {children}
    </MantineProvider>
  )
}
