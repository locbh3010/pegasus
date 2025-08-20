'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle, Zap, Shield, Rocket } from 'lucide-react'

export default function LandingPage() {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20 text-center">
                <div className="mx-auto max-w-4xl">
                    <h1 className="text-foreground mb-6 text-4xl font-bold md:text-6xl">
                        Manage Your Tasks with <span className="text-primary">Pegasus</span>
                    </h1>
                    <p className="text-muted-foreground mb-8 text-xl md:text-2xl">
                        A modern, intuitive task management platform designed to help you stay
                        organized and productive.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                        <Button size="lg" className="px-8 text-lg" asChild>
                            <Link href="/auth/signup">
                                Get Started
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="px-8 text-lg" asChild>
                            <Link href="/auth/signin">Sign In</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-4 py-16">
                <div className="mx-auto max-w-4xl">
                    <h2 className="text-foreground mb-12 text-center text-3xl font-bold">
                        Why Choose Pegasus?
                    </h2>

                    <div className="grid gap-8 md:grid-cols-3">
                        {/* Feature 1 */}
                        <div className="text-center">
                            <div className="mb-4 flex justify-center">
                                <div className="bg-primary/10 rounded-full p-3">
                                    <Zap className="text-primary h-8 w-8" />
                                </div>
                            </div>
                            <h3 className="text-foreground mb-2 text-xl font-semibold">
                                Fast & Intuitive
                            </h3>
                            <p className="text-muted-foreground">
                                Lightning-fast performance with an intuitive interface that gets out
                                of your way.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="text-center">
                            <div className="mb-4 flex justify-center">
                                <div className="bg-primary/10 rounded-full p-3">
                                    <Shield className="text-primary h-8 w-8" />
                                </div>
                            </div>
                            <h3 className="text-foreground mb-2 text-xl font-semibold">
                                Secure & Reliable
                            </h3>
                            <p className="text-muted-foreground">
                                Your data is protected with enterprise-grade security and reliable
                                cloud infrastructure.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="text-center">
                            <div className="mb-4 flex justify-center">
                                <div className="bg-primary/10 rounded-full p-3">
                                    <CheckCircle className="text-primary h-8 w-8" />
                                </div>
                            </div>
                            <h3 className="text-foreground mb-2 text-xl font-semibold">
                                Get Things Done
                            </h3>
                            <p className="text-muted-foreground">
                                Powerful features to help you organize, prioritize, and complete
                                your tasks efficiently.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 py-16">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-foreground mb-4 text-3xl font-bold">
                        Ready to Get Started?
                    </h2>
                    <p className="text-muted-foreground mb-8 text-lg">
                        Join thousands of users who are already managing their tasks more
                        effectively with Pegasus.
                    </p>
                    <Button size="lg" className="px-8 text-lg" asChild>
                        <Link href="/auth/signup">
                            Create Your Account
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-background/95 border-t backdrop-blur">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col items-center justify-between md:flex-row">
                        <div className="mb-4 flex items-center space-x-2 md:mb-0">
                            <Rocket className="text-primary h-6 w-6" />
                            <span className="text-foreground text-lg font-semibold">Pegasus</span>
                        </div>
                        <p className="text-muted-foreground text-sm">
                            © 2024 Pegasus. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
