'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Navbar } from './navbar'
import { Sidebar } from './sidebar'
import { LayoutProps } from '@/types'

export const MainLayout = ({ children }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { data: session } = useSession()

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar 
        onSidebarToggle={toggleSidebar} 
        isSidebarOpen={isSidebarOpen}
      />
      
      <div className="flex">
        {/* Sidebar - only show when authenticated */}
        {session && (
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={closeSidebar}
          />
        )}
        
        {/* Main Content */}
        <main 
          className={`flex-1 transition-all duration-300 ${
            session && isSidebarOpen 
              ? 'lg:ml-64' 
              : session 
                ? 'lg:ml-16' 
                : ''
          }`}
        >
          <div className="pt-16"> {/* Account for fixed navbar height */}
            {children}
          </div>
        </main>
      </div>
      
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}
    </div>
  )
}
