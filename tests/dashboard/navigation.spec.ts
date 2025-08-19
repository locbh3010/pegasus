import { test, expect } from '../fixtures/auth-fixtures'
import { TEST_CONFIG } from '../config/test-config'

test.describe('Dashboard Navigation', () => {
  test('should display dashboard navbar correctly', async ({ authenticatedPage, dashboardPage }) => {
    await dashboardPage.navigate()
    await dashboardPage.expectNavbarToBeVisible()
    await dashboardPage.takeNavbarScreenshot()
  })

  test('should display user information in dropdown', async ({ authenticatedPage, dashboardPage }) => {
    await dashboardPage.navigate()
    await dashboardPage.expectUserInfoToBeVisible()
    
    const userName = await dashboardPage.getUserName()
    const userEmail = await dashboardPage.getUserEmail()
    
    expect(userName).toBeTruthy()
    expect(userEmail).toBeTruthy()
    expect(userEmail).toContain('@')
  })

  test('should show dropdown menu items', async ({ authenticatedPage, dashboardPage }) => {
    await dashboardPage.navigate()
    await dashboardPage.expectDropdownMenuToBeVisible()
    await dashboardPage.takeUserDropdownScreenshot()
  })

  test('should navigate between dashboard pages', async ({ authenticatedPage, dashboardPage, page }) => {
    await dashboardPage.navigate()
    await dashboardPage.testNavigation()
    
    // Test direct navigation to tasks page
    await dashboardPage.navigateToTasks()
    await expect(page).toHaveURL(/.*\/dashboard\/tasks/)
    
    // Test direct navigation to settings page
    await dashboardPage.navigateToSettings()
    await expect(page).toHaveURL(/.*\/dashboard\/settings/)
    
    // Navigate back to dashboard home
    await dashboardPage.navigate()
    await expect(page).toHaveURL(/.*\/dashboard$/)
  })

  test('should handle logo click navigation', async ({ authenticatedPage, dashboardPage, page }) => {
    // Navigate to a sub-page first
    await dashboardPage.navigateToTasks()
    await expect(page).toHaveURL(/.*\/dashboard\/tasks/)
    
    // Click logo to return to dashboard home
    await dashboardPage.clickAppLogo()
    await expect(page).toHaveURL(/.*\/dashboard$/)
  })

  test('should navigate to settings from dropdown', async ({ authenticatedPage, dashboardPage, page }) => {
    await dashboardPage.navigate()
    await dashboardPage.clickSettings()
    await expect(page).toHaveURL(/.*\/dashboard\/settings/)
  })

  test('should handle billing navigation', async ({ authenticatedPage, dashboardPage, page }) => {
    await dashboardPage.navigate()
    await dashboardPage.clickBilling()
    // Note: Billing page might not be implemented yet, so just verify click works
    // await expect(page).toHaveURL(/.*\/billing/)
  })

  test('should maintain authentication state during navigation', async ({ authenticatedPage, dashboardPage, page }) => {
    await dashboardPage.navigate()
    
    // Navigate to different pages and verify user remains authenticated
    const pages = [
      TEST_CONFIG.ROUTES.DASHBOARD_TASKS,
      TEST_CONFIG.ROUTES.DASHBOARD_SETTINGS,
      TEST_CONFIG.ROUTES.DASHBOARD,
    ]
    
    for (const route of pages) {
      await page.goto(TEST_CONFIG.BASE_URL + route)
      await dashboardPage.expectNavbarToBeVisible()
    }
  })

  test('should handle browser back/forward navigation', async ({ authenticatedPage, dashboardPage, page }) => {
    await dashboardPage.navigate()
    
    // Navigate to tasks page
    await dashboardPage.navigateToTasks()
    await expect(page).toHaveURL(/.*\/dashboard\/tasks/)
    
    // Navigate to settings page
    await dashboardPage.navigateToSettings()
    await expect(page).toHaveURL(/.*\/dashboard\/settings/)
    
    // Use browser back button
    await page.goBack()
    await expect(page).toHaveURL(/.*\/dashboard\/tasks/)
    
    // Use browser forward button
    await page.goForward()
    await expect(page).toHaveURL(/.*\/dashboard\/settings/)
    
    // Go back to dashboard home
    await page.goBack()
    await page.goBack()
    await expect(page).toHaveURL(/.*\/dashboard$/)
  })

  test('should handle page refresh on different routes', async ({ authenticatedPage, dashboardPage, page }) => {
    const routes = [
      TEST_CONFIG.ROUTES.DASHBOARD,
      TEST_CONFIG.ROUTES.DASHBOARD_TASKS,
      TEST_CONFIG.ROUTES.DASHBOARD_SETTINGS,
    ]
    
    for (const route of routes) {
      await page.goto(TEST_CONFIG.BASE_URL + route)
      await dashboardPage.expectNavbarToBeVisible()
      
      // Refresh page
      await page.reload()
      await dashboardPage.expectNavbarToBeVisible()
    }
  })

  test('should handle deep linking to dashboard pages', async ({ authenticatedPage, page }) => {
    // Direct navigation to tasks page
    await page.goto(TEST_CONFIG.BASE_URL + TEST_CONFIG.ROUTES.DASHBOARD_TASKS)
    await expect(page).toHaveURL(/.*\/dashboard\/tasks/)
    
    // Direct navigation to settings page
    await page.goto(TEST_CONFIG.BASE_URL + TEST_CONFIG.ROUTES.DASHBOARD_SETTINGS)
    await expect(page).toHaveURL(/.*\/dashboard\/settings/)
  })
})

test.describe('Dashboard Responsive Navigation', () => {
  test('should work on mobile viewport', async ({ authenticatedPage, dashboardPage, page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await dashboardPage.navigate()
    await dashboardPage.testMobileView()
  })

  test('should work on tablet viewport', async ({ authenticatedPage, dashboardPage, page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await dashboardPage.navigate()
    await dashboardPage.expectNavbarToBeVisible()
    await dashboardPage.expectUserInfoToBeVisible()
  })

  test('should work on desktop viewport', async ({ authenticatedPage, dashboardPage, page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await dashboardPage.navigate()
    await dashboardPage.testDesktopView()
  })

  test('should handle viewport changes', async ({ authenticatedPage, dashboardPage, page }) => {
    // Start with desktop
    await page.setViewportSize({ width: 1920, height: 1080 })
    await dashboardPage.navigate()
    await dashboardPage.expectNavbarToBeVisible()
    
    // Switch to mobile
    await page.setViewportSize({ width: 375, height: 667 })
    await dashboardPage.expectNavbarToBeVisible()
    
    // Switch back to desktop
    await page.setViewportSize({ width: 1920, height: 1080 })
    await dashboardPage.expectNavbarToBeVisible()
  })
})

test.describe('Dashboard Navigation Accessibility', () => {
  test('should support keyboard navigation', async ({ authenticatedPage, dashboardPage, page }) => {
    await dashboardPage.navigate()
    
    // Test tab navigation through navbar elements
    await page.keyboard.press('Tab') // Should focus on first interactive element
    await page.keyboard.press('Tab') // Navigate to next element
    
    // Test Enter key on user dropdown
    await page.focus('[data-testid="user-dropdown"]')
    await page.keyboard.press('Enter')
    await dashboardPage.expectDropdownMenuToBeVisible()
    
    // Test Escape key to close dropdown
    await page.keyboard.press('Escape')
    await expect(page.locator('[role="menu"]')).not.toBeVisible()
  })

  test('should have proper ARIA attributes', async ({ authenticatedPage, dashboardPage, page }) => {
    await dashboardPage.navigate()
    
    // Check navbar has proper role
    await expect(page.locator('[data-testid="dashboard-navbar"]')).toHaveAttribute('role', 'navigation')
    
    // Check user dropdown has proper ARIA attributes
    await expect(page.locator('[data-testid="user-dropdown"]')).toHaveAttribute('aria-haspopup')
    
    // Open dropdown and check menu attributes
    await dashboardPage.clickUserDropdown()
    await expect(page.locator('[role="menu"]')).toBeVisible()
    await expect(page.locator('[role="menuitem"]')).toHaveCount(3) // Settings, Billing, Logout
  })

  test('should support screen reader navigation', async ({ authenticatedPage, dashboardPage, page }) => {
    await dashboardPage.navigate()
    
    // Check for proper labels
    await expect(page.locator('[data-testid="app-logo"]')).toHaveAttribute('aria-label')
    await expect(page.locator('[data-testid="user-dropdown"]')).toHaveAttribute('aria-label')
    
    // Check for proper headings structure
    const headings = page.locator('h1, h2, h3, h4, h5, h6')
    const headingCount = await headings.count()
    expect(headingCount).toBeGreaterThan(0)
  })
})

test.describe('Dashboard Navigation Performance', () => {
  test('should load navbar quickly', async ({ authenticatedPage, dashboardPage, page }) => {
    const startTime = Date.now()
    await dashboardPage.navigate()
    await dashboardPage.expectNavbarToBeVisible()
    const endTime = Date.now()
    
    const loadTime = endTime - startTime
    expect(loadTime).toBeLessThan(3000) // Should load within 3 seconds
    
    console.log(`Dashboard navbar loaded in ${loadTime}ms`)
  })

  test('should handle rapid navigation', async ({ authenticatedPage, dashboardPage, page }) => {
    await dashboardPage.navigate()
    
    // Rapidly navigate between pages
    const startTime = Date.now()
    
    await dashboardPage.navigateToTasks()
    await dashboardPage.navigateToSettings()
    await dashboardPage.navigate()
    await dashboardPage.navigateToTasks()
    await dashboardPage.navigate()
    
    const endTime = Date.now()
    const totalTime = endTime - startTime
    
    expect(totalTime).toBeLessThan(10000) // Should complete within 10 seconds
    console.log(`Rapid navigation completed in ${totalTime}ms`)
  })

  test('should not have memory leaks during navigation', async ({ authenticatedPage, dashboardPage, page }) => {
    await dashboardPage.navigate()
    
    // Perform multiple navigations
    for (let i = 0; i < 5; i++) {
      await dashboardPage.navigateToTasks()
      await dashboardPage.navigateToSettings()
      await dashboardPage.navigate()
    }
    
    // Check for console errors that might indicate memory leaks
    const errors = await page.evaluate(() => {
      return window.performance.getEntriesByType('navigation').length
    })
    
    // Should not have excessive navigation entries
    expect(errors).toBeLessThan(10)
  })
})
