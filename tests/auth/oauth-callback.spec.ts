import { test, expect } from '../fixtures/auth-fixtures'
import { TEST_CONFIG } from '../config/test-config'

test.describe('OAuth Callback Flow', () => {
  test.beforeEach(async ({ cleanBrowserState }) => {
    await cleanBrowserState()
  })

  test('should handle successful Google OAuth callback', async ({ callbackPage, dashboardPage }) => {
    const logs = await callbackPage.testSuccessfulCallback('google')
    await dashboardPage.expectToBeOnDashboard()
    
    // Verify logs contain expected OAuth processing steps
    expect(logs.some(log => log.includes('OAuth parameters found'))).toBeTruthy()
    expect(logs.some(log => log.includes('session created'))).toBeTruthy()
  })

  test('should handle successful GitHub OAuth callback', async ({ callbackPage, dashboardPage }) => {
    const logs = await callbackPage.testSuccessfulCallback('github')
    await dashboardPage.expectToBeOnDashboard()
    
    // Verify logs contain expected OAuth processing steps
    expect(logs.some(log => log.includes('OAuth parameters found'))).toBeTruthy()
    expect(logs.some(log => log.includes('session created'))).toBeTruthy()
  })

  test('should handle failed OAuth callback', async ({ callbackPage, signInPage }) => {
    const logs = await callbackPage.testFailedCallback('google')
    await signInPage.expectToBeOnSignInPage()
    
    // Verify error handling logs
    expect(logs.some(log => log.includes('error'))).toBeTruthy()
  })

  test('should handle OAuth callback timeout', async ({ callbackPage, signInPage }) => {
    const logs = await callbackPage.testCallbackTimeout()
    await callbackPage.expectTimeoutError()
    
    // Verify timeout logs
    expect(logs.some(log => log.includes('timeout'))).toBeTruthy()
  })

  test('should handle callback without OAuth parameters', async ({ callbackPage, signInPage }) => {
    await callbackPage.navigateToCallback()
    await callbackPage.waitForCallbackCompletion()
    await signInPage.expectToBeOnSignInPage()
  })

  test('should handle callback with invalid code', async ({ callbackPage, signInPage }) => {
    await callbackPage.navigateToCallback({ 
      code: 'invalid_code',
      state: 'invalid_state' 
    })
    await callbackPage.waitForCallbackCompletion()
    await signInPage.expectToBeOnSignInPage()
  })

  test('should handle callback with error parameter', async ({ callbackPage, signInPage }) => {
    await callbackPage.navigateToCallback({ 
      error: 'access_denied',
      error_description: 'User denied access' 
    })
    await callbackPage.waitForCallbackCompletion()
    await signInPage.expectToBeOnSignInPage()
  })

  test('should measure callback performance', async ({ callbackPage }) => {
    const duration = await callbackPage.measureCallbackPerformance()
    
    // Callback should complete within reasonable time
    expect(duration).toBeLessThan(TEST_CONFIG.TIMEOUTS.OAUTH_CALLBACK)
    
    console.log(`OAuth callback completed in ${duration}ms`)
  })

  test('should handle callback with redirect parameter', async ({ callbackPage, page }) => {
    const redirectTo = '/dashboard/tasks'
    await callbackPage.navigateToCallback({ 
      code: 'valid_code',
      state: 'valid_state',
      redirect_to: redirectTo
    })
    await callbackPage.waitForCallbackCompletion()
    
    // Should redirect to specified page
    await expect(page).toHaveURL(new RegExp(`.*${redirectTo}`))
  })

  test('should monitor network requests during callback', async ({ callbackPage, page }) => {
    const requests = await callbackPage.monitorNetworkRequests()
    
    await callbackPage.simulateOAuthCallback('google', true)
    await callbackPage.waitForCallbackCompletion()
    
    // Verify expected API calls were made
    expect(requests.some(req => req.url.includes('auth'))).toBeTruthy()
    expect(requests.some(req => req.url.includes('session'))).toBeTruthy()
  })

  test('should handle multiple concurrent callbacks', async ({ page }) => {
    const context = page.context()
    const page2 = await context.newPage()
    
    const callbackPage1 = new (await import('../pages/auth/callback-page')).CallbackPage(page)
    const callbackPage2 = new (await import('../pages/auth/callback-page')).CallbackPage(page2)
    
    // Simulate concurrent OAuth callbacks
    await Promise.all([
      callbackPage1.simulateOAuthCallback('google', true),
      callbackPage2.simulateOAuthCallback('github', true),
    ])
    
    // Both should complete successfully
    await Promise.all([
      callbackPage1.waitForCallbackCompletion(),
      callbackPage2.waitForCallbackCompletion(),
    ])
    
    await page2.close()
  })
})

test.describe('Simple OAuth Callback Flow', () => {
  test('should handle successful callback with simple flow', async ({ callbackPage, dashboardPage }) => {
    const logs = await callbackPage.testSimpleCallbackFlow('google')
    await dashboardPage.expectToBeOnDashboard()
    
    // Verify simple callback logs
    expect(logs.some(log => log.includes('Simple callback'))).toBeTruthy()
  })

  test('should retry on session check failure', async ({ callbackPage, page }) => {
    // Navigate to simple callback with code
    await callbackPage.navigateToSimpleCallback({ 
      code: 'retry_test_code',
      state: 'retry_state' 
    })
    
    // Monitor console for retry attempts
    const retryLogs: string[] = []
    page.on('console', (msg) => {
      if (msg.text().includes('Retry')) {
        retryLogs.push(msg.text())
      }
    })
    
    await callbackPage.waitForCallbackCompletion()
    
    // Should have attempted retries
    expect(retryLogs.length).toBeGreaterThan(0)
  })

  test('should handle max retries reached', async ({ callbackPage, signInPage, page }) => {
    // Simulate scenario where session never gets created
    await page.route('**/auth/v1/token**', route => route.abort())
    
    await callbackPage.navigateToSimpleCallback({ 
      code: 'max_retry_code',
      state: 'max_retry_state' 
    })
    
    await callbackPage.waitForCallbackCompletion()
    await signInPage.expectToBeOnSignInPage()
  })
})

test.describe('OAuth Callback Error Recovery', () => {
  test('should provide back to sign-in option on error', async ({ callbackPage, signInPage }) => {
    await callbackPage.simulateOAuthCallback('google', false)
    await callbackPage.waitForCallbackCompletion()
    await callbackPage.expectErrorState()
    
    await callbackPage.clickBackToSignIn()
    await signInPage.expectToBeOnSignInPage()
  })

  test('should clear browser state on callback error', async ({ callbackPage, page }) => {
    // Set some initial state
    await page.evaluate(() => {
      localStorage.setItem('test-key', 'test-value')
      sessionStorage.setItem('test-session', 'test-value')
    })
    
    await callbackPage.simulateOAuthCallback('google', false)
    await callbackPage.waitForCallbackCompletion()
    
    // State should be cleared
    const localStorage = await page.evaluate(() => localStorage.getItem('test-key'))
    const sessionStorage = await page.evaluate(() => sessionStorage.getItem('test-session'))
    
    expect(localStorage).toBeNull()
    expect(sessionStorage).toBeNull()
  })

  test('should handle callback page refresh', async ({ callbackPage, page }) => {
    await callbackPage.navigateToCallback({ 
      code: 'refresh_test_code',
      state: 'refresh_state' 
    })
    
    // Refresh the page during processing
    await page.reload()
    
    // Should still handle the callback or redirect appropriately
    await callbackPage.waitForCallbackCompletion()
  })
})

test.describe('OAuth Callback Visual Testing', () => {
  test('should capture callback processing state', async ({ callbackPage }) => {
    await callbackPage.simulateOAuthCallback('google', true)
    await callbackPage.expectProcessingState()
    await callbackPage.takeCallbackScreenshot('processing')
  })

  test('should capture callback error state', async ({ callbackPage }) => {
    await callbackPage.simulateOAuthCallback('google', false)
    await callbackPage.waitForCallbackCompletion()
    await callbackPage.expectErrorState()
    await callbackPage.takeCallbackScreenshot('error')
  })

  test('should capture callback timeout state', async ({ callbackPage }) => {
    await callbackPage.simulateOAuthCallbackWithTimeout()
    await callbackPage.waitForCallbackTimeout()
    await callbackPage.expectTimeoutError()
    await callbackPage.takeCallbackScreenshot('timeout')
  })
})
