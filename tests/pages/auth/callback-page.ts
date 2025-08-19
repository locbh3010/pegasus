import { Page, expect } from '@playwright/test'
import { BasePage } from '../base-page'
import { TEST_CONFIG } from '../../config/test-config'

export class CallbackPage extends BasePage {
  // Selectors
  private readonly loadingSpinner = '.animate-spin'
  private readonly processingMessage = 'text=Processing OAuth callback'
  private readonly errorMessage = '[data-testid="error-message"]'
  private readonly timeoutMessage = 'text=timeout'
  private readonly backToSignInButton = 'text=Back to Sign In'

  constructor(page: Page) {
    super(page)
  }

  // Navigation
  async navigateToCallback(params?: Record<string, string>) {
    let url = TEST_CONFIG.ROUTES.CALLBACK
    if (params) {
      const searchParams = new URLSearchParams(params)
      url += `?${searchParams.toString()}`
    }
    await this.goto(url)
  }

  async navigateToSimpleCallback(params?: Record<string, string>) {
    let url = TEST_CONFIG.ROUTES.CALLBACK_SIMPLE
    if (params) {
      const searchParams = new URLSearchParams(params)
      url += `?${searchParams.toString()}`
    }
    await this.goto(url)
  }

  // OAuth callback simulation
  async simulateOAuthCallback(provider: 'google' | 'github', success = true) {
    const params: Record<string, string> = {}
    
    if (success) {
      // Simulate successful OAuth callback with code
      params.code = `mock_oauth_code_${provider}_${Date.now()}`
      params.state = 'mock_state'
      if (provider === 'google') {
        params.scope = 'openid email profile'
      }
    } else {
      // Simulate OAuth error
      params.error = 'access_denied'
      params.error_description = 'User denied access'
    }
    
    await this.navigateToCallback(params)
  }

  async simulateOAuthCallbackWithTimeout() {
    // Simulate callback that will timeout
    const params = {
      code: 'timeout_code',
      state: 'timeout_state'
    }
    await this.navigateToCallback(params)
  }

  // Assertions
  async expectToBeOnCallbackPage() {
    await this.expectToHaveUrl(/.*\/auth\/callback/)
  }

  async expectToBeOnSimpleCallbackPage() {
    await this.expectToHaveUrl(/.*\/auth\/callback-simple/)
  }

  async expectProcessingState() {
    await this.expectToBeVisible(this.loadingSpinner)
    await this.expectToBeVisible(this.processingMessage)
  }

  async expectErrorState() {
    await this.expectToBeVisible(this.errorMessage)
  }

  async expectTimeoutError() {
    await this.expectToBeVisible(this.timeoutMessage)
  }

  async expectRedirectToDashboard() {
    await this.waitForUrl(/.*\/dashboard/, TEST_CONFIG.TIMEOUTS.OAUTH_CALLBACK)
  }

  async expectRedirectToSignIn() {
    await this.waitForUrl(/.*\/auth\/signin/, TEST_CONFIG.TIMEOUTS.OAUTH_CALLBACK)
  }

  // Wait for callback completion
  async waitForCallbackCompletion() {
    // Wait for either success (redirect to dashboard) or error
    await Promise.race([
      this.waitForUrl(/.*\/dashboard/, TEST_CONFIG.TIMEOUTS.OAUTH_CALLBACK),
      this.waitForUrl(/.*\/auth\/signin/, TEST_CONFIG.TIMEOUTS.OAUTH_CALLBACK),
      this.waitForSelector(this.errorMessage, TEST_CONFIG.TIMEOUTS.OAUTH_CALLBACK),
    ])
  }

  async waitForCallbackTimeout() {
    // Wait specifically for timeout scenario
    await this.waitForSelector(this.timeoutMessage, TEST_CONFIG.TIMEOUTS.OAUTH_CALLBACK + 5000)
  }

  // Monitor callback process
  async monitorCallbackLogs(): Promise<string[]> {
    const logs: string[] = []
    
    this.page.on('console', (msg) => {
      if (msg.text().includes('OAuth') || msg.text().includes('callback')) {
        logs.push(`${msg.type()}: ${msg.text()}`)
      }
    })
    
    return logs
  }

  async monitorNetworkRequests(): Promise<any[]> {
    const requests: any[] = []
    
    this.page.on('request', (request) => {
      if (request.url().includes('auth') || request.url().includes('supabase')) {
        requests.push({
          url: request.url(),
          method: request.method(),
          timestamp: Date.now(),
        })
      }
    })
    
    return requests
  }

  // Test specific scenarios
  async testSuccessfulCallback(provider: 'google' | 'github') {
    const logs = await this.monitorCallbackLogs()
    await this.simulateOAuthCallback(provider, true)
    await this.expectProcessingState()
    await this.waitForCallbackCompletion()
    await this.expectRedirectToDashboard()
    return logs
  }

  async testFailedCallback(provider: 'google' | 'github') {
    const logs = await this.monitorCallbackLogs()
    await this.simulateOAuthCallback(provider, false)
    await this.waitForCallbackCompletion()
    await this.expectRedirectToSignIn()
    return logs
  }

  async testCallbackTimeout() {
    const logs = await this.monitorCallbackLogs()
    await this.simulateOAuthCallbackWithTimeout()
    await this.expectProcessingState()
    await this.waitForCallbackTimeout()
    await this.expectTimeoutError()
    return logs
  }

  async testSimpleCallbackFlow(provider: 'google' | 'github') {
    const logs = await this.monitorCallbackLogs()
    const params = {
      code: `simple_oauth_code_${provider}_${Date.now()}`,
      state: 'simple_state'
    }
    await this.navigateToSimpleCallback(params)
    await this.waitForCallbackCompletion()
    return logs
  }

  // Error recovery
  async clickBackToSignIn() {
    await this.clickElement(this.backToSignInButton)
    await this.expectRedirectToSignIn()
  }

  // Visual testing
  async takeCallbackScreenshot(scenario: string) {
    await this.takeScreenshot(`callback-${scenario}`)
  }

  // Performance testing
  async measureCallbackPerformance() {
    const startTime = Date.now()
    await this.waitForCallbackCompletion()
    const endTime = Date.now()
    return endTime - startTime
  }
}
