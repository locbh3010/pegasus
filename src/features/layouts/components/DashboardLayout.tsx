'use client'

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { useAuth } from '@/features/auth'
import { AppSidebar } from '@/features/dashboard/components/app-sidebar'
import { SiteHeader } from '@/features/dashboard/components/site-header'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { loading } = useAuth()

    if (loading) {
        return (
            <div className="bg-background flex h-screen w-full items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                        <div className="border-muted border-t-primary h-12 w-12 animate-spin rounded-full border-4" />
                        <div className="border-primary/20 absolute inset-0 h-12 w-12 animate-pulse rounded-full border-4" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-foreground text-lg font-semibold">Loading...</h3>
                        <p className="text-muted-foreground text-sm">
                            Please wait while we prepare your workspace
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <SidebarProvider
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 72)',
                    '--header-height': 'calc(var(--spacing) * 12)',
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            <div className="px-4 lg:px-6">{children}</div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
