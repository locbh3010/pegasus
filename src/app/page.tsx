import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckCircle, Code, Palette, Zap } from 'lucide-react'
import { MainLayout } from '@/components/layout'

export default function Home() {
  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Next.js 15',
      description: 'Latest Next.js with App Router and Turbopack for blazing fast development',
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: 'TypeScript Strict Mode',
      description: 'Full type safety with strict TypeScript configuration',
    },
    {
      icon: <Palette className="h-6 w-6" />,
      title: 'Tailwind CSS v4',
      description: 'Latest Tailwind CSS with new features and improved performance',
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: 'ReUI Components',
      description: 'Beautiful, accessible components built on top of shadcn/ui',
    },
  ]

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="mb-16 space-y-6 text-center">
          <h1 className="text-foreground text-5xl font-bold">Task Manager</h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
            A modern web application built with Next.js 15, TypeScript, Tailwind CSS v4, and ReUI
            components. Experience the perfect blend of performance, type safety, and beautiful
            design.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button size="lg">
              Get Started
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>

        <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={index} className="space-y-4 p-6 text-center">
              <div className="bg-primary/10 text-primary mx-auto flex h-12 w-12 items-center justify-center rounded-lg">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </Card>
          ))}
        </div>
        <div className="space-y-4 text-center">
          <h2 className="text-2xl font-semibold">Ready to get started?</h2>
          <p className="text-muted-foreground">
            Create your account and start managing your tasks with our modern, secure platform.
          </p>
          <Button size="lg">
            Create Account
          </Button>
        </div>

        <footer className="border-border text-muted-foreground mt-16 border-t pt-8 text-center text-sm">
          <p>Built with ❤️ using Next.js, TypeScript, Tailwind CSS v4, and ReUI components</p>
        </footer>
      </div>
    </MainLayout>
  )
}
