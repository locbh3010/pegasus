import { test, expect } from '@playwright/test'

test('basic setup verification', async ({ page }) => {
  // Test that we can navigate to the application
  await page.goto('http://localhost:3000')
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle')
  
  // Check that the page title contains expected text
  await expect(page).toHaveTitle(/Task Manager|Pegasus/)
  
  // Check that we can see some basic elements
  const body = page.locator('body')
  await expect(body).toBeVisible()
  
  console.log('✅ Basic Playwright setup is working!')
})
