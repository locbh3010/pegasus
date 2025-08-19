import { Page, expect } from '@playwright/test'
import { BasePage } from '../base-page'
import { TEST_CONFIG } from '../../config/test-config'

export class SignUpPage extends BasePage {
  // Selectors
  private readonly emailInput = '[data-testid="email-input"]'
  private readonly passwordInput = '[data-testid="password-input"]'
  private readonly usernameInput = '[data-testid="username-input"]'
  private readonly signUpButton = '[data-testid="signup-button"]'
  private readonly googleButton = '[data-testid="google-oauth-button"]'
  private readonly githubButton = '[data-testid="github-oauth-button"]'
  private readonly signInLink = '[data-testid="signin-link"]'
  private readonly errorMessage = '[data-testid="error-message"]'
  private readonly successMessage = '[data-testid="success-message"]'
  private readonly loadingSpinner = '.animate-spin'

  constructor(page: Page) {
    super(page)
  }

  // Navigation
  async navigate() {
    await this.goto(TEST_CONFIG.ROUTES.SIGN_UP)
    await this.waitForPageLoad()
  }

  // Form interactions
  async fillEmail(email: string) {
    await this.fillInput(this.emailInput, email)
  }

  async fillPassword(password: string) {
    await this.fillInput(this.passwordInput, password)
  }

  async fillUsername(username: string) {
    await this.fillInput(this.usernameInput, username)
  }

  async clickSignUp() {
    await this.clickElement(this.signUpButton)
  }

  async clickGoogleOAuth() {
    await this.clickElement(this.googleButton)
  }

  async clickGitHubOAuth() {
    await this.clickElement(this.githubButton)
  }

  async clickSignInLink() {
    await this.clickElement(this.signInLink)
  }

  // Complete flows
  async signUpWithCredentials(email: string, password: string, username: string) {
    await this.fillEmail(email)
    await this.fillPassword(password)
    await this.fillUsername(username)
    await this.clickSignUp()
  }

  async signUpWithNewUser() {
    const newUser = TEST_CONFIG.TEST_DATA.NEW_USER
    await this.signUpWithCredentials(newUser.email, newUser.password, newUser.username)
  }

  async attemptOAuthSignUp(provider: 'google' | 'github') {
    if (provider === 'google') {
      await this.clickGoogleOAuth()
    } else {
      await this.clickGitHubOAuth()
    }
  }

  // Assertions
  async expectToBeOnSignUpPage() {
    await this.expectToHaveUrl(/.*\/auth\/signup/)
    await this.expectToBeVisible(this.emailInput)
    await this.expectToBeVisible(this.passwordInput)
    await this.expectToBeVisible(this.usernameInput)
    await this.expectToBeVisible(this.signUpButton)
  }

  async expectSignUpButtonToBeDisabled() {
    await expect(this.page.locator(this.signUpButton)).toBeDisabled()
  }

  async expectSignUpButtonToBeEnabled() {
    await expect(this.page.locator(this.signUpButton)).toBeEnabled()
  }

  async expectErrorMessage(message?: string) {
    await this.expectToBeVisible(this.errorMessage)
    if (message) {
      await this.expectToHaveText(this.errorMessage, message)
    }
  }

  async expectSuccessMessage(message?: string) {
    await this.expectToBeVisible(this.successMessage)
    if (message) {
      await this.expectToHaveText(this.successMessage, message)
    }
  }

  async expectLoadingState() {
    await this.expectToBeVisible(this.loadingSpinner)
  }

  async expectOAuthButtonsToBeVisible() {
    await this.expectToBeVisible(this.googleButton)
    await this.expectToBeVisible(this.githubButton)
  }

  // Wait for specific states
  async waitForSignUpCompletion() {
    // Wait for either success message, redirect, or error
    await Promise.race([
      this.waitForSelector(this.successMessage, TEST_CONFIG.TIMEOUTS.MEDIUM),
      this.waitForUrl(/.*\/dashboard/, TEST_CONFIG.TIMEOUTS.LONG),
      this.waitForSelector(this.errorMessage, TEST_CONFIG.TIMEOUTS.MEDIUM),
    ])
  }

  // Form validation
  async expectFormValidation() {
    // Test empty form
    await this.clickSignUp()
    await this.expectSignUpButtonToBeDisabled()

    // Test invalid email
    await this.fillEmail('invalid-email')
    await this.fillPassword('password')
    await this.fillUsername('username')
    await this.expectSignUpButtonToBeDisabled()

    // Test weak password
    await this.fillEmail('valid@email.com')
    await this.fillPassword('weak')
    await this.fillUsername('username')
    await this.expectSignUpButtonToBeDisabled()

    // Test valid form
    await this.fillEmail('valid@email.com')
    await this.fillPassword('StrongPassword123!')
    await this.fillUsername('validusername')
    await this.expectSignUpButtonToBeEnabled()
  }

  // Error scenarios
  async testDuplicateEmail() {
    await this.signUpWithCredentials(
      TEST_CONFIG.TEST_USERS.VALID_USER.email,
      'NewPassword123!',
      'newusername'
    )
    await this.waitForSignUpCompletion()
    await this.expectErrorMessage()
  }

  async testInvalidPassword() {
    await this.signUpWithCredentials(
      'new@email.com',
      'weak',
      'username'
    )
    await this.expectSignUpButtonToBeDisabled()
  }

  // Visual testing
  async takeSignUpPageScreenshot() {
    await this.takeScreenshot('signup-page')
  }
}
