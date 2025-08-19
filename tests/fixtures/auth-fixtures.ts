import { test as base, Page } from '@playwright/test'
import { SignInPage } from '../pages/auth/signin-page'
import { SignUpPage } from '../pages/auth/signup-page'
import { CallbackPage } from '../pages/auth/callback-page'
import { DashboardPage } from '../pages/dashboard/dashboard-page'
import { TEST_CONFIG } from '../config/test-config'

// Extend base test with custom fixtures
type AuthFixtures = {
  signInPage: SignInPage
  signUpPage: SignUpPage
  callbackPage: CallbackPage
  dashboardPage: DashboardPage
  authenticatedPage: Page
  cleanBrowserState: () => Promise<void>
}

export const test = base.extend<AuthFixtures>({
  // Sign In Page fixture
  signInPage: async ({ page }, use) => {
    const signInPage = new SignInPage(page)
    await use(signInPage)
  },

  // Sign Up Page fixture
  signUpPage: async ({ page }, use) => {
    const signUpPage = new SignUpPage(page)
    await use(signUpPage)
  },

  // Callback Page fixture
  callbackPage: async ({ page }, use) => {
    const callbackPage = new CallbackPage(page)
    await use(callbackPage)
  },

  // Dashboard Page fixture
  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page)
    await use(dashboardPage)
  },

  // Pre-authenticated page fixture
  authenticatedPage: async ({ page }, use) => {
    // Clear any existing state
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
    await page.context().clearCookies()

    // Navigate to sign-in page
    await page.goto(`${TEST_CONFIG.BASE_URL}${TEST_CONFIG.ROUTES.SIGN_IN}`)

    // Sign in with test user
    await page.fill('[data-testid="email-input"]', TEST_CONFIG.TEST_USERS.VALID_USER.email)
    await page.fill('[data-testid="password-input"]', TEST_CONFIG.TEST_USERS.VALID_USER.password)
    await page.click('[data-testid="signin-button"]')

    // Wait for successful authentication
    await page.waitForURL('**/dashboard**', { timeout: TEST_CONFIG.TIMEOUTS.LONG })

    await use(page)

    // Cleanup: logout after test
    try {
      await page.click('[data-testid="user-dropdown"]')
      await page.click('[data-testid="logout-button"]')
      await page.waitForURL('**/auth/signin**', { timeout: TEST_CONFIG.TIMEOUTS.LOGOUT })
    } catch (error) {
      console.log('Cleanup logout failed:', error)
    }
  },

  // Clean browser state fixture
  cleanBrowserState: async ({ page }, use) => {
    const cleanState = async () => {
      await page.evaluate(() => {
        localStorage.clear()
        sessionStorage.clear()
      })
      await page.context().clearCookies()
    }

    // Clean state before test
    await cleanState()

    await use(cleanState)

    // Clean state after test
    await cleanState()
  },
})

export { expect } from '@playwright/test'

// Helper functions for common authentication flows
export class AuthHelpers {
  static async signInUser(page: Page, email: string, password: string) {
    await page.goto(`${TEST_CONFIG.BASE_URL}${TEST_CONFIG.ROUTES.SIGN_IN}`)
    await page.fill('[data-testid="email-input"]', email)
    await page.fill('[data-testid="password-input"]', password)
    await page.click('[data-testid="signin-button"]')
    await page.waitForURL('**/dashboard**', { timeout: TEST_CONFIG.TIMEOUTS.LONG })
  }

  static async signUpUser(page: Page, email: string, password: string, username: string) {
    await page.goto(`${TEST_CONFIG.BASE_URL}${TEST_CONFIG.ROUTES.SIGN_UP}`)
    await page.fill('[data-testid="email-input"]', email)
    await page.fill('[data-testid="password-input"]', password)
    await page.fill('[data-testid="username-input"]', username)
    await page.click('[data-testid="signup-button"]')

    // Wait for either success or error
    await Promise.race([
      page.waitForURL('**/dashboard**', { timeout: TEST_CONFIG.TIMEOUTS.LONG }),
      page.waitForSelector('[data-testid="success-message"]', {
        timeout: TEST_CONFIG.TIMEOUTS.MEDIUM,
      }),
      page.waitForSelector('[data-testid="error-message"]', {
        timeout: TEST_CONFIG.TIMEOUTS.MEDIUM,
      }),
    ])
  }

  static async logoutUser(page: Page) {
    await page.click('[data-testid="user-dropdown"]')
    await page.click('[data-testid="logout-button"]')
    await page.waitForURL('**/auth/signin**', { timeout: TEST_CONFIG.TIMEOUTS.LOGOUT })
  }

  static async clearAuthState(page: Page) {
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
    await page.context().clearCookies()
  }

  static async waitForAuthRedirect(page: Page, expectedUrl: string | RegExp) {
    await page.waitForURL(expectedUrl, { timeout: TEST_CONFIG.TIMEOUTS.LONG })
  }

  static async simulateOAuthFlow(page: Page, provider: 'google' | 'github') {
    // Click OAuth button
    const oauthButton = `[data-testid="${provider}-oauth-button"]`
    await page.click(oauthButton)

    // Wait for OAuth provider redirect (in real tests, this would go to actual OAuth provider)
    // For testing, we'll simulate the callback
    const callbackUrl = `${TEST_CONFIG.BASE_URL}${TEST_CONFIG.ROUTES.CALLBACK}?code=test_code_${provider}&state=test_state`
    await page.goto(callbackUrl)

    // Wait for callback processing
    await page.waitForURL('**/dashboard**', { timeout: TEST_CONFIG.TIMEOUTS.OAUTH_CALLBACK })
  }

  static async expectAuthenticationError(page: Page, errorMessage?: string) {
    const { expect } = await import('@playwright/test')
    const errorElement = page.locator('[data-testid="error-message"]')
    await errorElement.waitFor({ state: 'visible', timeout: TEST_CONFIG.TIMEOUTS.MEDIUM })

    if (errorMessage) {
      await expect(errorElement).toHaveText(errorMessage)
    }
  }

  static async expectAuthenticationSuccess(page: Page) {
    const { expect } = await import('@playwright/test')
    await page.waitForURL('**/dashboard**', { timeout: TEST_CONFIG.TIMEOUTS.LONG })
    await expect(page.locator('[data-testid="dashboard-navbar"]')).toBeVisible()
  }

  static async monitorConsoleErrors(page: Page): Promise<string[]> {
    const errors: string[] = []

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    return errors
  }

  static async monitorNetworkRequests(page: Page, pattern: string): Promise<any[]> {
    const requests: any[] = []

    page.on('request', (request) => {
      if (request.url().includes(pattern)) {
        requests.push({
          url: request.url(),
          method: request.method(),
          headers: request.headers(),
          timestamp: Date.now(),
        })
      }
    })

    return requests
  }
}
