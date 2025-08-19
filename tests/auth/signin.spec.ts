import { test, expect } from '../fixtures/auth-fixtures'
import { TEST_CONFIG } from '../config/test-config'

test.describe('Sign In Flow', () => {
  test.beforeEach(async ({ cleanBrowserState }) => {
    await cleanBrowserState()
  })

  test('should display sign-in page correctly', async ({ signInPage }) => {
    await signInPage.navigate()
    await signInPage.expectToBeOnSignInPage()
    await signInPage.expectOAuthButtonsToBeVisible()
    await signInPage.takeSignInPageScreenshot()
  })

  test('should validate form inputs', async ({ signInPage }) => {
    await signInPage.navigate()
    await signInPage.expectFormValidation()
  })

  test('should sign in with valid credentials', async ({ signInPage, dashboardPage }) => {
    await signInPage.navigate()
    await signInPage.signInWithValidUser()
    await signInPage.waitForSignInCompletion()
    await dashboardPage.expectToBeOnDashboard()
  })

  test('should show error for invalid credentials', async ({ signInPage }) => {
    await signInPage.navigate()
    await signInPage.signInWithInvalidUser()
    await signInPage.waitForSignInCompletion()
    await signInPage.expectErrorMessage()
  })

  test('should handle network errors gracefully', async ({ signInPage }) => {
    await signInPage.navigate()
    await signInPage.testNetworkError()
  })

  test('should navigate to sign-up page', async ({ signInPage, signUpPage }) => {
    await signInPage.navigate()
    await signInPage.clickSignUpLink()
    await signUpPage.expectToBeOnSignUpPage()
  })

  test('should show loading state during sign-in', async ({ signInPage }) => {
    await signInPage.navigate()
    await signInPage.fillEmail(TEST_CONFIG.TEST_USERS.VALID_USER.email)
    await signInPage.fillPassword(TEST_CONFIG.TEST_USERS.VALID_USER.password)
    await signInPage.clickSignIn()
    await signInPage.expectLoadingState()
  })

  test('should handle OAuth button clicks', async ({ signInPage, page }) => {
    await signInPage.navigate()
    
    // Test Google OAuth button
    const googlePromise = page.waitForEvent('popup')
    await signInPage.clickGoogleOAuth()
    // Note: In real tests, this would redirect to Google OAuth
    
    // Test GitHub OAuth button
    await signInPage.navigate() // Reset page
    const githubPromise = page.waitForEvent('popup')
    await signInPage.clickGitHubOAuth()
    // Note: In real tests, this would redirect to GitHub OAuth
  })

  test('should persist authentication state', async ({ signInPage, dashboardPage, page }) => {
    // Sign in
    await signInPage.navigate()
    await signInPage.signInWithValidUser()
    await dashboardPage.expectToBeOnDashboard()
    
    // Refresh page
    await page.reload()
    await dashboardPage.expectToBeOnDashboard()
    
    // Navigate to different page and back
    await page.goto(TEST_CONFIG.BASE_URL + TEST_CONFIG.ROUTES.DASHBOARD_TASKS)
    await page.goto(TEST_CONFIG.BASE_URL + TEST_CONFIG.ROUTES.DASHBOARD)
    await dashboardPage.expectToBeOnDashboard()
  })

  test('should redirect authenticated users away from sign-in', async ({ authenticatedPage, signInPage }) => {
    // Try to navigate to sign-in page while authenticated
    await signInPage.navigate()
    // Should be redirected to dashboard
    await expect(authenticatedPage).toHaveURL(/.*\/dashboard/)
  })

  test('should handle concurrent sign-in attempts', async ({ page }) => {
    // Open multiple tabs and try to sign in simultaneously
    const context = page.context()
    const page2 = await context.newPage()
    
    const signInPage1 = new (await import('../pages/auth/signin-page')).SignInPage(page)
    const signInPage2 = new (await import('../pages/auth/signin-page')).SignInPage(page2)
    
    await signInPage1.navigate()
    await signInPage2.navigate()
    
    // Sign in on both pages simultaneously
    await Promise.all([
      signInPage1.signInWithValidUser(),
      signInPage2.signInWithValidUser(),
    ])
    
    // Both should eventually reach dashboard
    await Promise.all([
      signInPage1.waitForSignInCompletion(),
      signInPage2.waitForSignInCompletion(),
    ])
    
    await page2.close()
  })

  test('should handle session expiry', async ({ signInPage, dashboardPage, page }) => {
    // Sign in
    await signInPage.navigate()
    await signInPage.signInWithValidUser()
    await dashboardPage.expectToBeOnDashboard()
    
    // Simulate session expiry by clearing auth tokens
    await page.evaluate(() => {
      localStorage.removeItem('supabase.auth.token')
      sessionStorage.removeItem('supabase.auth.token')
    })
    
    // Try to access protected route
    await page.goto(TEST_CONFIG.BASE_URL + TEST_CONFIG.ROUTES.DASHBOARD_SETTINGS)
    
    // Should be redirected to sign-in
    await expect(page).toHaveURL(/.*\/auth\/signin/)
  })
})

test.describe('Sign In Accessibility', () => {
  test('should be accessible with keyboard navigation', async ({ signInPage, page }) => {
    await signInPage.navigate()
    
    // Test tab navigation
    await page.keyboard.press('Tab') // Email input
    await expect(page.locator('[data-testid="email-input"]')).toBeFocused()
    
    await page.keyboard.press('Tab') // Password input
    await expect(page.locator('[data-testid="password-input"]')).toBeFocused()
    
    await page.keyboard.press('Tab') // Sign in button
    await expect(page.locator('[data-testid="signin-button"]')).toBeFocused()
    
    // Test form submission with Enter
    await page.fill('[data-testid="email-input"]', TEST_CONFIG.TEST_USERS.VALID_USER.email)
    await page.fill('[data-testid="password-input"]', TEST_CONFIG.TEST_USERS.VALID_USER.password)
    await page.keyboard.press('Enter')
    
    await signInPage.waitForSignInCompletion()
  })

  test('should have proper ARIA labels', async ({ signInPage, page }) => {
    await signInPage.navigate()
    
    // Check for proper labels and ARIA attributes
    await expect(page.locator('[data-testid="email-input"]')).toHaveAttribute('aria-label')
    await expect(page.locator('[data-testid="password-input"]')).toHaveAttribute('aria-label')
    await expect(page.locator('[data-testid="signin-button"]')).toHaveAttribute('aria-label')
  })
})
