import { TEST_CONFIG } from '../config/test-config'

export class TestDataGenerator {
  static generateUniqueEmail(): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(7)
    return `test-${timestamp}-${random}@example.com`
  }

  static generateUniqueUsername(): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(7)
    return `testuser-${timestamp}-${random}`
  }

  static generateStrongPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    let password = ''
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password + '1!' // Ensure it meets requirements
  }

  static generateWeakPassword(): string {
    return 'weak'
  }

  static generateInvalidEmail(): string {
    return 'invalid-email'
  }

  static generateTestUser() {
    return {
      email: this.generateUniqueEmail(),
      password: this.generateStrongPassword(),
      username: this.generateUniqueUsername(),
    }
  }

  static generateOAuthCallbackParams(provider: 'google' | 'github', success = true) {
    if (success) {
      return {
        code: `test_oauth_code_${provider}_${Date.now()}`,
        state: `test_state_${Date.now()}`,
        ...(provider === 'google' && { scope: 'openid email profile' }),
      }
    } else {
      return {
        error: 'access_denied',
        error_description: 'User denied access',
        state: `test_state_${Date.now()}`,
      }
    }
  }

  static generateExpiredSessionData() {
    return {
      access_token: 'expired_token',
      refresh_token: 'expired_refresh',
      expires_at: Date.now() - 1000, // Expired 1 second ago
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
      },
    }
  }

  static generateValidSessionData() {
    return {
      access_token: 'valid_token',
      refresh_token: 'valid_refresh',
      expires_at: Date.now() + 3600000, // Expires in 1 hour
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        user_metadata: {
          username: 'testuser',
          full_name: 'Test User',
        },
      },
    }
  }
}

export class TestDataCleanup {
  static async clearBrowserStorage(page: any) {
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
    await page.context().clearCookies()
  }

  static async clearAuthTokens(page: any) {
    await page.evaluate(() => {
      localStorage.removeItem('supabase.auth.token')
      sessionStorage.removeItem('supabase.auth.token')
      localStorage.removeItem('auth-lastLoginTime')
      localStorage.removeItem('auth-sessionExpiry')
    })
  }

  static async setMockSessionData(page: any, sessionData: any) {
    await page.evaluate((data) => {
      localStorage.setItem('supabase.auth.token', JSON.stringify(data))
    }, sessionData)
  }

  static async simulateNetworkError(page: any, pattern: string) {
    await page.route(pattern, route => route.abort())
  }

  static async simulateSlowNetwork(page: any, pattern: string, delay = 5000) {
    await page.route(pattern, route => {
      setTimeout(() => route.continue(), delay)
    })
  }

  static async simulateNetworkTimeout(page: any, pattern: string) {
    await page.route(pattern, route => {
      // Never respond to simulate timeout
    })
  }
}

export class TestAssertions {
  static async expectUrlPattern(page: any, pattern: string | RegExp) {
    const { expect } = await import('@playwright/test')
    await expect(page).toHaveURL(pattern)
  }

  static async expectElementVisible(page: any, selector: string) {
    const { expect } = await import('@playwright/test')
    await expect(page.locator(selector)).toBeVisible()
  }

  static async expectElementHidden(page: any, selector: string) {
    const { expect } = await import('@playwright/test')
    await expect(page.locator(selector)).not.toBeVisible()
  }

  static async expectElementText(page: any, selector: string, text: string) {
    const { expect } = await import('@playwright/test')
    await expect(page.locator(selector)).toHaveText(text)
  }

  static async expectElementCount(page: any, selector: string, count: number) {
    const { expect } = await import('@playwright/test')
    await expect(page.locator(selector)).toHaveCount(count)
  }

  static async expectConsoleError(page: any, errorPattern: string | RegExp) {
    const { expect } = await import('@playwright/test')
    
    return new Promise((resolve) => {
      page.on('console', (msg: any) => {
        if (msg.type() === 'error') {
          const text = msg.text()
          const matches = typeof errorPattern === 'string' 
            ? text.includes(errorPattern)
            : errorPattern.test(text)
          
          if (matches) {
            resolve(true)
          }
        }
      })
      
      // Timeout after 5 seconds
      setTimeout(() => resolve(false), 5000)
    })
  }

  static async expectNoConsoleErrors(page: any) {
    const errors: string[] = []
    
    page.on('console', (msg: any) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    
    // Wait a bit to collect any errors
    await page.waitForTimeout(1000)
    
    const { expect } = await import('@playwright/test')
    expect(errors).toHaveLength(0)
  }
}

export class TestWaits {
  static async waitForAuthRedirect(page: any, expectedUrl: string | RegExp) {
    await page.waitForURL(expectedUrl, { timeout: TEST_CONFIG.TIMEOUTS.LONG })
  }

  static async waitForElementToAppear(page: any, selector: string, timeout = TEST_CONFIG.TIMEOUTS.MEDIUM) {
    await page.waitForSelector(selector, { state: 'visible', timeout })
  }

  static async waitForElementToDisappear(page: any, selector: string, timeout = TEST_CONFIG.TIMEOUTS.MEDIUM) {
    await page.waitForSelector(selector, { state: 'detached', timeout })
  }

  static async waitForNetworkIdle(page: any, timeout = TEST_CONFIG.TIMEOUTS.MEDIUM) {
    await page.waitForLoadState('networkidle', { timeout })
  }

  static async waitForPageLoad(page: any, timeout = TEST_CONFIG.TIMEOUTS.MEDIUM) {
    await page.waitForLoadState('load', { timeout })
  }

  static async waitForCondition(condition: () => Promise<boolean>, timeout = TEST_CONFIG.TIMEOUTS.MEDIUM) {
    const startTime = Date.now()
    
    while (Date.now() - startTime < timeout) {
      if (await condition()) {
        return true
      }
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    throw new Error(`Condition not met within ${timeout}ms`)
  }
}

export class TestMetrics {
  static async measurePageLoadTime(page: any, url: string) {
    const startTime = Date.now()
    await page.goto(url)
    await page.waitForLoadState('networkidle')
    const endTime = Date.now()
    
    return endTime - startTime
  }

  static async measureActionTime(action: () => Promise<void>) {
    const startTime = Date.now()
    await action()
    const endTime = Date.now()
    
    return endTime - startTime
  }

  static async getNetworkRequests(page: any, pattern?: string) {
    const requests: any[] = []
    
    page.on('request', (request: any) => {
      if (!pattern || request.url().includes(pattern)) {
        requests.push({
          url: request.url(),
          method: request.method(),
          timestamp: Date.now(),
        })
      }
    })
    
    return requests
  }

  static async getConsoleMessages(page: any, type?: string) {
    const messages: any[] = []
    
    page.on('console', (msg: any) => {
      if (!type || msg.type() === type) {
        messages.push({
          type: msg.type(),
          text: msg.text(),
          timestamp: Date.now(),
        })
      }
    })
    
    return messages
  }
}
