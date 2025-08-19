import { test, expect } from '../fixtures/auth-fixtures'
import { TEST_CONFIG } from '../config/test-config'

test.describe('Logout Flow', () => {
  test('should logout successfully from dashboard', async ({ authenticatedPage, dashboardPage, signInPage }) => {
    await dashboardPage.navigate()
    await dashboardPage.expectToBeOnDashboard()
    
    const logs = await dashboardPage.monitorLogoutProcess()
    await dashboardPage.performLogout()
    
    await signInPage.expectToBeOnSignInPage()
    
    // Verify logout logs
    expect(logs.some(log => log.includes('Starting logout'))).toBeTruthy()
    expect(logs.some(log => log.includes('Logout successful'))).toBeTruthy()
  })

  test('should show loading state during logout', async ({ authenticatedPage, dashboardPage }) => {
    await dashboardPage.navigate()
    await dashboardPage.expectLogoutButtonToShowLoading()
  })

  test('should clear authentication state after logout', async ({ authenticatedPage, dashboardPage, signInPage, page }) => {
    await dashboardPage.navigate()
    await dashboardPage.performLogout()
    
    // Verify auth state is cleared
    const localStorage = await page.evaluate(() => localStorage.getItem('supabase.auth.token'))
    const sessionStorage = await page.evaluate(() => sessionStorage.getItem('supabase.auth.token'))
    
    expect(localStorage).toBeNull()
    expect(sessionStorage).toBeNull()
    
    // Try to access protected route
    await page.goto(TEST_CONFIG.BASE_URL + TEST_CONFIG.ROUTES.DASHBOARD)
    await signInPage.expectToBeOnSignInPage()
  })

  test('should handle logout timeout gracefully', async ({ authenticatedPage, dashboardPage, signInPage }) => {
    await dashboardPage.navigate()
    
    const logs = await dashboardPage.testLogoutTimeout()
    await signInPage.expectToBeOnSignInPage()
    
    // Should still redirect even on timeout
    expect(logs.some(log => log.includes('timeout') || log.includes('error'))).toBeTruthy()
  })

  test('should handle logout network error', async ({ authenticatedPage, dashboardPage, signInPage }) => {
    await dashboardPage.navigate()
    
    const logs = await dashboardPage.testLogoutError()
    await signInPage.expectToBeOnSignInPage()
    
    // Should still redirect even on network error
    expect(logs.some(log => log.includes('error'))).toBeTruthy()
  })

  test('should measure logout performance', async ({ authenticatedPage, dashboardPage }) => {
    await dashboardPage.navigate()
    
    const duration = await dashboardPage.measureLogoutPerformance()
    
    // Logout should complete within timeout limit
    expect(duration).toBeLessThan(TEST_CONFIG.TIMEOUTS.LOGOUT)
    
    console.log(`Logout completed in ${duration}ms`)
  })

  test('should logout from multiple tabs', async ({ authenticatedPage, page }) => {
    const context = page.context()
    const page2 = await context.newPage()
    
    // Navigate both pages to dashboard
    await page.goto(TEST_CONFIG.BASE_URL + TEST_CONFIG.ROUTES.DASHBOARD)
    await page2.goto(TEST_CONFIG.BASE_URL + TEST_CONFIG.ROUTES.DASHBOARD)
    
    // Logout from first tab
    await page.click('[data-testid="user-dropdown"]')
    await page.click('[data-testid="logout-button"]')
    await page.waitForURL('**/auth/signin**')
    
    // Second tab should also be logged out (or redirect on next action)
    await page2.reload()
    await expect(page2).toHaveURL(/.*\/auth\/signin/)
    
    await page2.close()
  })

  test('should handle concurrent logout attempts', async ({ authenticatedPage, page }) => {
    const context = page.context()
    const page2 = await context.newPage()
    
    // Navigate both pages to dashboard
    await page.goto(TEST_CONFIG.BASE_URL + TEST_CONFIG.ROUTES.DASHBOARD)
    await page2.goto(TEST_CONFIG.BASE_URL + TEST_CONFIG.ROUTES.DASHBOARD)
    
    // Attempt logout from both tabs simultaneously
    await Promise.all([
      (async () => {
        await page.click('[data-testid="user-dropdown"]')
        await page.click('[data-testid="logout-button"]')
      })(),
      (async () => {
        await page2.click('[data-testid="user-dropdown"]')
        await page2.click('[data-testid="logout-button"]')
      })(),
    ])
    
    // Both should end up on sign-in page
    await Promise.all([
      page.waitForURL('**/auth/signin**'),
      page2.waitForURL('**/auth/signin**'),
    ])
    
    await page2.close()
  })

  test('should prevent access to protected routes after logout', async ({ authenticatedPage, dashboardPage, signInPage, page }) => {
    await dashboardPage.navigate()
    await dashboardPage.performLogout()
    
    // Try to access various protected routes
    const protectedRoutes = [
      TEST_CONFIG.ROUTES.DASHBOARD,
      TEST_CONFIG.ROUTES.DASHBOARD_TASKS,
      TEST_CONFIG.ROUTES.DASHBOARD_SETTINGS,
    ]
    
    for (const route of protectedRoutes) {
      await page.goto(TEST_CONFIG.BASE_URL + route)
      await signInPage.expectToBeOnSignInPage()
    }
  })

  test('should handle logout during navigation', async ({ authenticatedPage, dashboardPage, page }) => {
    await dashboardPage.navigate()
    
    // Start navigation to another page
    const navigationPromise = page.goto(TEST_CONFIG.BASE_URL + TEST_CONFIG.ROUTES.DASHBOARD_TASKS)
    
    // Immediately trigger logout
    await dashboardPage.clickLogout()
    
    // Wait for both operations to complete
    await Promise.all([
      navigationPromise,
      dashboardPage.waitForLogoutCompletion(),
    ])
    
    // Should end up on sign-in page
    await expect(page).toHaveURL(/.*\/auth\/signin/)
  })

  test('should handle logout with unsaved changes warning', async ({ authenticatedPage, page }) => {
    await page.goto(TEST_CONFIG.BASE_URL + TEST_CONFIG.ROUTES.DASHBOARD_SETTINGS)
    
    // Simulate unsaved changes (if applicable)
    await page.evaluate(() => {
      window.addEventListener('beforeunload', (e) => {
        e.preventDefault()
        e.returnValue = ''
      })
    })
    
    // Attempt logout
    await page.click('[data-testid="user-dropdown"]')
    await page.click('[data-testid="logout-button"]')
    
    // Should still logout successfully
    await page.waitForURL('**/auth/signin**', { timeout: TEST_CONFIG.TIMEOUTS.LOGOUT })
  })
})

test.describe('Logout Edge Cases', () => {
  test('should handle logout when already logged out', async ({ page, signInPage }) => {
    // Navigate to sign-in page (not authenticated)
    await signInPage.navigate()
    
    // Try to access logout endpoint directly
    await page.goto(TEST_CONFIG.BASE_URL + TEST_CONFIG.ROUTES.LOGOUT)
    
    // Should redirect to sign-in
    await signInPage.expectToBeOnSignInPage()
  })

  test('should handle logout with expired session', async ({ authenticatedPage, dashboardPage, signInPage, page }) => {
    await dashboardPage.navigate()
    
    // Simulate expired session
    await page.evaluate(() => {
      localStorage.setItem('supabase.auth.token', JSON.stringify({
        access_token: 'expired_token',
        expires_at: Date.now() - 1000, // Expired 1 second ago
      }))
    })
    
    // Attempt logout
    await dashboardPage.performLogout()
    
    // Should still redirect to sign-in
    await signInPage.expectToBeOnSignInPage()
  })

  test('should handle logout with corrupted session data', async ({ authenticatedPage, dashboardPage, signInPage, page }) => {
    await dashboardPage.navigate()
    
    // Corrupt session data
    await page.evaluate(() => {
      localStorage.setItem('supabase.auth.token', 'corrupted_data')
    })
    
    // Attempt logout
    await dashboardPage.performLogout()
    
    // Should still redirect to sign-in
    await signInPage.expectToBeOnSignInPage()
  })

  test('should handle logout during page refresh', async ({ authenticatedPage, dashboardPage, page }) => {
    await dashboardPage.navigate()
    
    // Start logout process
    await page.click('[data-testid="user-dropdown"]')
    await page.click('[data-testid="logout-button"]')
    
    // Immediately refresh page
    await page.reload()
    
    // Should end up on sign-in page
    await expect(page).toHaveURL(/.*\/auth\/signin/)
  })
})

test.describe('Logout Visual Testing', () => {
  test('should capture logout loading state', async ({ authenticatedPage, dashboardPage }) => {
    await dashboardPage.navigate()
    await dashboardPage.clickUserDropdown()
    await dashboardPage.takeUserDropdownScreenshot()
    
    await dashboardPage.clickLogout()
    // Capture loading state if visible
    await dashboardPage.takeScreenshot('logout-loading')
  })

  test('should capture post-logout sign-in page', async ({ authenticatedPage, dashboardPage, signInPage }) => {
    await dashboardPage.navigate()
    await dashboardPage.performLogout()
    await signInPage.takeSignInPageScreenshot()
  })
})
