import { chromium, FullConfig } from '@playwright/test'
import { TEST_CONFIG } from './config/test-config'

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global test setup...')

  // Create a browser instance for setup
  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()

  try {
    // Wait for the application to be ready
    console.log('⏳ Waiting for application to be ready...')
    await page.goto(TEST_CONFIG.BASE_URL, { waitUntil: 'networkidle' })
    
    // Verify the application is running
    await page.waitForSelector('body', { timeout: 30000 })
    console.log('✅ Application is ready')

    // Pre-authenticate a test user if needed
    if (process.env.SETUP_TEST_USER === 'true') {
      console.log('👤 Setting up test user authentication...')
      await setupTestUser(page)
    }

    // Clear any existing test data
    console.log('🧹 Cleaning up existing test data...')
    await cleanupTestData(page)

    console.log('✅ Global setup completed successfully')

  } catch (error) {
    console.error('❌ Global setup failed:', error)
    throw error
  } finally {
    await context.close()
    await browser.close()
  }
}

async function setupTestUser(page: any) {
  try {
    // Navigate to sign-up page
    await page.goto(`${TEST_CONFIG.BASE_URL}${TEST_CONFIG.ROUTES.SIGN_UP}`)
    
    // Check if test user already exists by trying to sign in
    await page.goto(`${TEST_CONFIG.BASE_URL}${TEST_CONFIG.ROUTES.SIGN_IN}`)
    
    // Try to sign in with test credentials
    await page.fill('[data-testid="email-input"]', TEST_CONFIG.TEST_USERS.VALID_USER.email)
    await page.fill('[data-testid="password-input"]', TEST_CONFIG.TEST_USERS.VALID_USER.password)
    await page.click('[data-testid="signin-button"]')
    
    // Wait for either success or error
    await page.waitForTimeout(3000)
    
    const currentUrl = page.url()
    if (currentUrl.includes('/dashboard')) {
      console.log('✅ Test user already exists and can sign in')
      // Sign out for clean state
      await page.click('[data-testid="user-dropdown"]')
      await page.click('[data-testid="logout-button"]')
      await page.waitForURL('**/auth/signin')
    } else {
      console.log('👤 Creating new test user...')
      // User doesn't exist, create one
      await createTestUser(page)
    }
  } catch (error) {
    console.log('⚠️ Test user setup skipped:', error.message)
  }
}

async function createTestUser(page: any) {
  await page.goto(`${TEST_CONFIG.BASE_URL}${TEST_CONFIG.ROUTES.SIGN_UP}`)
  
  await page.fill('[data-testid="email-input"]', TEST_CONFIG.TEST_USERS.VALID_USER.email)
  await page.fill('[data-testid="password-input"]', TEST_CONFIG.TEST_USERS.VALID_USER.password)
  await page.fill('[data-testid="username-input"]', TEST_CONFIG.TEST_USERS.VALID_USER.username)
  await page.click('[data-testid="signup-button"]')
  
  // Wait for success or handle email confirmation
  await page.waitForTimeout(5000)
}

async function cleanupTestData(page: any) {
  // Clear localStorage and sessionStorage
  await page.evaluate(() => {
    localStorage.clear()
    sessionStorage.clear()
  })
  
  // Clear cookies
  await page.context().clearCookies()
}

export default globalSetup
