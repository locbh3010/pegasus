'use client'

import Link from 'next/link'
import { type LucideIcon } from 'lucide-react'
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar'

export function NavSecondary({
    items,
    ...props
}: {
    items: {
        title: string
        url: string
        icon: LucideIcon
    }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
    const { state } = useSidebar()
    const isCollapsed = state === 'collapsed'

    return (
        <SidebarGroup {...props}>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            {isCollapsed ? (
                                <div className="flex w-full justify-center">
                                    <SidebarMenuButton
                                        asChild
                                        size="sm"
                                        tooltip={item.title}
                                        className="hover:!bg-transparent"
                                        style={{
                                            padding: '0',
                                            paddingLeft: '0',
                                            paddingRight: '0',
                                            paddingTop: '0',
                                            paddingBottom: '0',
                                        }}
                                    >
                                        <Link
                                            href={item.url}
                                            style={{
                                                padding: '0',
                                                paddingLeft: '0',
                                                paddingRight: '0',
                                                paddingTop: '0',
                                                paddingBottom: '0',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                            className="hover:!bg-transparent"
                                        >
                                            <item.icon />
                                        </Link>
                                    </SidebarMenuButton>
                                </div>
                            ) : (
                                <SidebarMenuButton asChild size="sm" tooltip={item.title}>
                                    <Link href={item.url}>
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            )}
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
