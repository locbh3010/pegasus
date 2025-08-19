import { Page, expect } from '@playwright/test'
import { BasePage } from '../base-page'
import { TEST_CONFIG, TestUser } from '../../config/test-config'

export class SignInPage extends BasePage {
  // Selectors
  private readonly emailInput = '[data-testid="email-input"]'
  private readonly passwordInput = '[data-testid="password-input"]'
  private readonly signInButton = '[data-testid="signin-button"]'
  private readonly googleButton = '[data-testid="google-oauth-button"]'
  private readonly githubButton = '[data-testid="github-oauth-button"]'
  private readonly signUpLink = '[data-testid="signup-link"]'
  private readonly forgotPasswordLink = '[data-testid="forgot-password-link"]'
  private readonly errorMessage = '[data-testid="error-message"]'
  private readonly loadingSpinner = '.animate-spin'

  constructor(page: Page) {
    super(page)
  }

  // Navigation
  async navigate() {
    await this.goto(TEST_CONFIG.ROUTES.SIGN_IN)
    await this.waitForPageLoad()
  }

  // Form interactions
  async fillEmail(email: string) {
    await this.fillInput(this.emailInput, email)
  }

  async fillPassword(password: string) {
    await this.fillInput(this.passwordInput, password)
  }

  async clickSignIn() {
    await this.clickElement(this.signInButton)
  }

  async clickGoogleOAuth() {
    await this.clickElement(this.googleButton)
  }

  async clickGitHubOAuth() {
    await this.clickElement(this.githubButton)
  }

  async clickSignUpLink() {
    await this.clickElement(this.signUpLink)
  }

  async clickForgotPasswordLink() {
    await this.clickElement(this.forgotPasswordLink)
  }

  // Complete flows
  async signInWithCredentials(user: TestUser) {
    await this.fillEmail(user.email)
    await this.fillPassword(user.password)
    await this.clickSignIn()
  }

  async signInWithValidUser() {
    await this.signInWithCredentials(TEST_CONFIG.TEST_USERS.VALID_USER)
  }

  async signInWithInvalidUser() {
    await this.signInWithCredentials(TEST_CONFIG.TEST_USERS.INVALID_USER)
  }

  async attemptOAuthSignIn(provider: 'google' | 'github') {
    if (provider === 'google') {
      await this.clickGoogleOAuth()
    } else {
      await this.clickGitHubOAuth()
    }
  }

  // Assertions
  async expectToBeOnSignInPage() {
    await this.expectToHaveUrl(/.*\/auth\/signin/)
    await this.expectToBeVisible(this.emailInput)
    await this.expectToBeVisible(this.passwordInput)
    await this.expectToBeVisible(this.signInButton)
  }

  async expectSignInButtonToBeDisabled() {
    await expect(this.page.locator(this.signInButton)).toBeDisabled()
  }

  async expectSignInButtonToBeEnabled() {
    await expect(this.page.locator(this.signInButton)).toBeEnabled()
  }

  async expectErrorMessage(message?: string) {
    await this.expectToBeVisible(this.errorMessage)
    if (message) {
      await this.expectToHaveText(this.errorMessage, message)
    }
  }

  async expectNoErrorMessage() {
    await expect(this.page.locator(this.errorMessage)).not.toBeVisible()
  }

  async expectLoadingState() {
    await this.expectToBeVisible(this.loadingSpinner)
  }

  async expectNotLoadingState() {
    await expect(this.page.locator(this.loadingSpinner)).not.toBeVisible()
  }

  async expectOAuthButtonsToBeVisible() {
    await this.expectToBeVisible(this.googleButton)
    await this.expectToBeVisible(this.githubButton)
  }

  // Wait for specific states
  async waitForSignInCompletion() {
    // Wait for either success (redirect to dashboard) or error
    await Promise.race([
      this.waitForUrl(/.*\/dashboard/, TEST_CONFIG.TIMEOUTS.LONG),
      this.waitForSelector(this.errorMessage, TEST_CONFIG.TIMEOUTS.MEDIUM),
    ])
  }

  async waitForOAuthRedirect() {
    // Wait for OAuth provider redirect
    await this.page.waitForURL(/(?!.*localhost).*/, { 
      timeout: TEST_CONFIG.TIMEOUTS.OAUTH_CALLBACK 
    })
  }

  // Form validation
  async expectFormValidation() {
    // Test empty form
    await this.clickSignIn()
    await this.expectSignInButtonToBeDisabled()

    // Test invalid email
    await this.fillEmail('invalid-email')
    await this.fillPassword('password')
    await this.expectSignInButtonToBeDisabled()

    // Test valid form
    await this.fillEmail('valid@email.com')
    await this.fillPassword('validpassword')
    await this.expectSignInButtonToBeEnabled()
  }

  // Visual testing
  async takeSignInPageScreenshot() {
    await this.takeScreenshot('signin-page')
  }

  // Error scenarios
  async testNetworkError() {
    // Simulate network failure
    await this.page.route('**/auth/v1/token**', route => route.abort())
    await this.signInWithValidUser()
    await this.expectErrorMessage()
  }

  async testInvalidCredentials() {
    await this.signInWithInvalidUser()
    await this.waitForSignInCompletion()
    await this.expectErrorMessage()
  }
}
