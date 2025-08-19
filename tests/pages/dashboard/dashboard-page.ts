import { Page, expect } from '@playwright/test'
import { BasePage } from '../base-page'
import { TEST_CONFIG } from '../../config/test-config'

export class DashboardPage extends BasePage {
  // Selectors
  private readonly navbar = '[data-testid="dashboard-navbar"]'
  private readonly userDropdown = '[data-testid="user-dropdown"]'
  private readonly userAvatar = '[data-testid="user-avatar"]'
  private readonly userName = '[data-testid="user-name"]'
  private readonly userEmail = '[data-testid="user-email"]'
  private readonly logoutButton = '[data-testid="logout-button"]'
  private readonly settingsButton = '[data-testid="settings-button"]'
  private readonly billingButton = '[data-testid="billing-button"]'
  private readonly appLogo = '[data-testid="app-logo"]'
  private readonly appName = '[data-testid="app-name"]'
  private readonly welcomeMessage = '[data-testid="welcome-message"]'
  private readonly taskStats = '[data-testid="task-stats"]'
  private readonly recentTasks = '[data-testid="recent-tasks"]'
  private readonly loadingSpinner = '.animate-spin'

  constructor(page: Page) {
    super(page)
  }

  // Navigation
  async navigate() {
    await this.goto(TEST_CONFIG.ROUTES.DASHBOARD)
    await this.waitForPageLoad()
  }

  async navigateToTasks() {
    await this.goto(TEST_CONFIG.ROUTES.DASHBOARD_TASKS)
    await this.waitForPageLoad()
  }

  async navigateToSettings() {
    await this.goto(TEST_CONFIG.ROUTES.DASHBOARD_SETTINGS)
    await this.waitForPageLoad()
  }

  // Navbar interactions
  async clickUserDropdown() {
    await this.clickElement(this.userDropdown)
  }

  async clickLogout() {
    await this.clickUserDropdown()
    await this.clickElement(this.logoutButton)
  }

  async clickSettings() {
    await this.clickUserDropdown()
    await this.clickElement(this.settingsButton)
  }

  async clickBilling() {
    await this.clickUserDropdown()
    await this.clickElement(this.billingButton)
  }

  async clickAppLogo() {
    await this.clickElement(this.appLogo)
  }

  // Logout flow
  async performLogout() {
    await this.clickLogout()
    await this.waitForLogoutCompletion()
  }

  async waitForLogoutCompletion() {
    // Wait for redirect to sign-in page
    await this.waitForUrl(/.*\/auth\/signin/, TEST_CONFIG.TIMEOUTS.LOGOUT)
  }

  async monitorLogoutProcess(): Promise<string[]> {
    const logs: string[] = []
    
    this.page.on('console', (msg) => {
      if (msg.text().includes('logout') || msg.text().includes('signOut')) {
        logs.push(`${msg.type()}: ${msg.text()}`)
      }
    })
    
    return logs
  }

  // Assertions
  async expectToBeOnDashboard() {
    await this.expectToHaveUrl(/.*\/dashboard/)
    await this.expectToBeVisible(this.navbar)
    await this.expectToBeVisible(this.userDropdown)
  }

  async expectNavbarToBeVisible() {
    await this.expectToBeVisible(this.navbar)
    await this.expectToBeVisible(this.appLogo)
    await this.expectToBeVisible(this.appName)
    await this.expectToBeVisible(this.userDropdown)
  }

  async expectUserInfoToBeVisible() {
    await this.clickUserDropdown()
    await this.expectToBeVisible(this.userAvatar)
    await this.expectToBeVisible(this.userName)
    await this.expectToBeVisible(this.userEmail)
  }

  async expectDropdownMenuToBeVisible() {
    await this.clickUserDropdown()
    await this.expectToBeVisible(this.settingsButton)
    await this.expectToBeVisible(this.billingButton)
    await this.expectToBeVisible(this.logoutButton)
  }

  async expectWelcomeMessage() {
    await this.expectToBeVisible(this.welcomeMessage)
  }

  async expectDashboardContent() {
    await this.expectToBeVisible(this.taskStats)
    await this.expectToBeVisible(this.recentTasks)
  }

  async expectLogoutButtonToShowLoading() {
    await this.clickUserDropdown()
    await this.clickElement(this.logoutButton)
    await expect(this.page.locator(this.logoutButton)).toHaveText(/signing out/i)
  }

  // User information
  async getUserName(): Promise<string> {
    await this.clickUserDropdown()
    return await this.getText(this.userName)
  }

  async getUserEmail(): Promise<string> {
    await this.clickUserDropdown()
    return await this.getText(this.userEmail)
  }

  // Navigation testing
  async testNavigation() {
    // Test logo click
    await this.clickAppLogo()
    await this.expectToHaveUrl(/.*\/dashboard/)

    // Test settings navigation
    await this.clickSettings()
    await this.expectToHaveUrl(/.*\/dashboard\/settings/)

    // Navigate back to dashboard
    await this.navigate()
    await this.expectToBeOnDashboard()
  }

  // Responsive testing
  async testMobileView() {
    await this.page.setViewportSize({ width: 375, height: 667 })
    await this.expectNavbarToBeVisible()
    
    // Test mobile dropdown behavior
    await this.clickUserDropdown()
    await this.expectDropdownMenuToBeVisible()
  }

  async testDesktopView() {
    await this.page.setViewportSize({ width: 1920, height: 1080 })
    await this.expectNavbarToBeVisible()
    await this.expectUserInfoToBeVisible()
  }

  // Error scenarios
  async testLogoutError() {
    // Simulate network error during logout
    await this.page.route('**/auth/v1/logout**', route => route.abort())
    
    const logs = await this.monitorLogoutProcess()
    await this.performLogout()
    
    // Should still redirect even on error
    await this.expectToHaveUrl(/.*\/auth\/signin/)
    return logs
  }

  async testLogoutTimeout() {
    // Simulate slow logout response
    await this.page.route('**/auth/v1/logout**', route => {
      setTimeout(() => route.continue(), 10000)
    })
    
    const logs = await this.monitorLogoutProcess()
    await this.performLogout()
    
    // Should timeout and redirect
    await this.expectToHaveUrl(/.*\/auth\/signin/)
    return logs
  }

  // Performance testing
  async measureLogoutPerformance() {
    const startTime = Date.now()
    await this.performLogout()
    const endTime = Date.now()
    return endTime - startTime
  }

  // Visual testing
  async takeDashboardScreenshot() {
    await this.takeScreenshot('dashboard-page')
  }

  async takeNavbarScreenshot() {
    await this.page.locator(this.navbar).screenshot({ 
      path: `test-results/screenshots/navbar-${Date.now()}.png` 
    })
  }

  async takeUserDropdownScreenshot() {
    await this.clickUserDropdown()
    await this.page.locator('[role="menu"]').screenshot({ 
      path: `test-results/screenshots/user-dropdown-${Date.now()}.png` 
    })
  }
}
