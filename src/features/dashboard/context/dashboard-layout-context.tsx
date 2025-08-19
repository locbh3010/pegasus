'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface DashboardLayoutContextType {
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void
  projectsExpanded: boolean
  setProjectsExpanded: (expanded: boolean) => void
  toggleProjects: () => void
  userManuallyCollapsed: boolean
  resetManualCollapse: () => void
}

const DashboardLayoutContext = createContext<DashboardLayoutContextType | undefined>(undefined)

const SIDEBAR_STORAGE_KEY = 'dashboard-sidebar-collapsed'
const PROJECTS_STORAGE_KEY = 'dashboard-projects-expanded'

export function DashboardLayoutProvider({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [projectsExpanded, setProjectsExpanded] = useState(true)
  const [userManuallyCollapsed, setUserManuallyCollapsed] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true)

    // Load sidebar state from localStorage
    const savedSidebarState = localStorage.getItem(SIDEBAR_STORAGE_KEY)
    if (savedSidebarState !== null) {
      setSidebarCollapsed(JSON.parse(savedSidebarState))
    }

    // Load projects state from localStorage
    const savedProjectsState = localStorage.getItem(PROJECTS_STORAGE_KEY)
    if (savedProjectsState !== null) {
      setProjectsExpanded(JSON.parse(savedProjectsState))
    }

    // Auto-collapse sidebar on mobile
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true)
      }
    }

    handleResize() // Check on mount
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Save sidebar state to localStorage
  useEffect(() => {
    if (isClient) {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(sidebarCollapsed))
    }
  }, [sidebarCollapsed, isClient])

  // Save projects state to localStorage
  useEffect(() => {
    if (isClient) {
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projectsExpanded))
    }
  }, [projectsExpanded, isClient])

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const toggleProjects = () => {
    const newExpanded = !projectsExpanded
    setProjectsExpanded(newExpanded)
    // If user is collapsing (newExpanded = false), mark as manually collapsed
    if (!newExpanded) {
      setUserManuallyCollapsed(true)
    } else {
      setUserManuallyCollapsed(false)
    }
  }

  const resetManualCollapse = () => {
    setUserManuallyCollapsed(false)
  }

  const value: DashboardLayoutContextType = {
    sidebarCollapsed,
    setSidebarCollapsed,
    toggleSidebar,
    projectsExpanded,
    setProjectsExpanded,
    toggleProjects,
    userManuallyCollapsed,
    resetManualCollapse,
  }

  return <DashboardLayoutContext.Provider value={value}>{children}</DashboardLayoutContext.Provider>
}

export function useDashboardLayout() {
  const context = useContext(DashboardLayoutContext)
  if (context === undefined) {
    throw new Error('useDashboardLayout must be used within a DashboardLayoutProvider')
  }
  return context
}
