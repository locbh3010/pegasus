'use client'

import { Button } from '@/components/ui/button'
import LandingPage from '@/features/landing/pages/LandingPage'
import { Rocket } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
    return (
        <div className="bg-background min-h-screen">
            {/* Header */}
            <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 border-b backdrop-blur">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <Rocket className="text-primary h-8 w-8" />
                        <span className="text-foreground text-2xl font-bold">Pegasus</span>
                    </Link>

                    {/* Navigation */}
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" asChild>
                            <Link href="/auth/signin">Sign In</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/auth/signup">Sign Up</Link>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main>
                <LandingPage />
            </main>
        </div>
    )
}
