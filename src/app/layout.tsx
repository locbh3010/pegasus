import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '@/components/query-provider'
import { AuthProvider } from '@/features/auth/components/auth-provider'
import { ProjectsProvider } from '@/features/projects/context'
import { ThemeProvider } from 'next-themes'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Task Manager - Next.js + TypeScript + Tailwind v4 + ReUI',
  description:
    'A modern task management application built with Next.js, TypeScript, Tailwind CSS v4, and ReUI components',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <ProjectsProvider>
              <QueryProvider>{children}</QueryProvider>
            </ProjectsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
