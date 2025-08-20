'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { CommandPalette } from './command-palette'

export function CommandPaletteTrigger() {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                setIsOpen(true)
            }
            if (e.key === 'Escape') {
                setIsOpen(false)
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [])

    return (
        <>
            <Button
                variant="outline"
                className="text-muted-foreground relative h-9 w-full justify-start text-sm sm:pr-12 md:w-40 lg:w-64"
                onClick={() => setIsOpen(true)}
            >
                <Search className="mr-2 h-4 w-4" />
                <span className="hidden lg:inline-flex">Search documentation...</span>
                <span className="inline-flex lg:hidden">Search...</span>
                <kbd className="bg-muted pointer-events-none absolute top-1.5 right-1.5 hidden h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button>

            <CommandPalette isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    )
}
