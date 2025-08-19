import { Page, Locator, expect } from '@playwright/test'
import { TEST_CONFIG } from '../config/test-config'

export abstract class BasePage {
  protected page: Page

  constructor(page: Page) {
    this.page = page
  }

  // Common navigation methods
  async goto(path: string) {
    await this.page.goto(`${TEST_CONFIG.BASE_URL}${path}`)
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle')
  }

  async waitForUrl(pattern: string | RegExp, timeout = TEST_CONFIG.TIMEOUTS.MEDIUM) {
    await this.page.waitForURL(pattern, { timeout })
  }

  // Common element interactions
  async clickElement(selector: string) {
    await this.page.click(selector)
  }

  async fillInput(selector: string, value: string) {
    await this.page.fill(selector, value)
  }

  async getText(selector: string): Promise<string> {
    return await this.page.textContent(selector) || ''
  }

  async isVisible(selector: string): Promise<boolean> {
    return await this.page.isVisible(selector)
  }

  async waitForSelector(selector: string, timeout = TEST_CONFIG.TIMEOUTS.MEDIUM) {
    await this.page.waitForSelector(selector, { timeout })
  }

  // Common assertions
  async expectToBeVisible(selector: string) {
    await expect(this.page.locator(selector)).toBeVisible()
  }

  async expectToHaveText(selector: string, text: string) {
    await expect(this.page.locator(selector)).toHaveText(text)
  }

  async expectToHaveUrl(pattern: string | RegExp) {
    await expect(this.page).toHaveURL(pattern)
  }

  // Error handling
  async getErrorMessage(): Promise<string | null> {
    try {
      const errorElement = this.page.locator('[data-testid="error-message"], .error, .text-destructive')
      if (await errorElement.isVisible()) {
        return await errorElement.textContent()
      }
      return null
    } catch {
      return null
    }
  }

  // Loading states
  async waitForLoadingToComplete(timeout = TEST_CONFIG.TIMEOUTS.MEDIUM) {
    try {
      // Wait for any loading spinners to disappear
      await this.page.waitForSelector('.animate-spin', { state: 'detached', timeout })
    } catch {
      // Loading spinner might not exist, continue
    }
  }

  // Screenshot helpers
  async takeScreenshot(name: string) {
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}-${Date.now()}.png`,
      fullPage: true 
    })
  }

  // Console log monitoring
  async monitorConsoleErrors(): Promise<string[]> {
    const errors: string[] = []
    
    this.page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    
    return errors
  }

  // Network monitoring
  async monitorNetworkRequests(): Promise<any[]> {
    const requests: any[] = []
    
    this.page.on('request', (request) => {
      requests.push({
        url: request.url(),
        method: request.method(),
        headers: request.headers(),
      })
    })
    
    return requests
  }

  // Clear browser state
  async clearBrowserState() {
    await this.page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
    await this.page.context().clearCookies()
  }
}
