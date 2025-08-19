import { chromium, FullConfig } from '@playwright/test'
import { TEST_CONFIG } from './config/test-config'

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global test teardown...')

  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()

  try {
    // Clean up test data
    console.log('🗑️ Cleaning up test data...')
    await cleanupTestData(page)

    // Generate test report summary
    console.log('📊 Generating test report summary...')
    await generateTestSummary()

    console.log('✅ Global teardown completed successfully')

  } catch (error) {
    console.error('❌ Global teardown failed:', error)
    // Don't throw error in teardown to avoid masking test failures
  } finally {
    await context.close()
    await browser.close()
  }
}

async function cleanupTestData(page: any) {
  try {
    // Navigate to application
    await page.goto(TEST_CONFIG.BASE_URL)
    
    // Clear browser storage
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
    
    // Clear cookies
    await page.context().clearCookies()
    
    console.log('✅ Test data cleanup completed')
  } catch (error) {
    console.log('⚠️ Test data cleanup failed:', error.message)
  }
}

async function generateTestSummary() {
  try {
    const fs = require('fs')
    const path = require('path')
    
    const resultsPath = path.join(process.cwd(), 'test-results', 'results.json')
    
    if (fs.existsSync(resultsPath)) {
      const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'))
      
      const summary = {
        timestamp: new Date().toISOString(),
        total: results.stats?.total || 0,
        passed: results.stats?.passed || 0,
        failed: results.stats?.failed || 0,
        skipped: results.stats?.skipped || 0,
        duration: results.stats?.duration || 0,
      }
      
      console.log('📊 Test Summary:')
      console.log(`   Total: ${summary.total}`)
      console.log(`   Passed: ${summary.passed}`)
      console.log(`   Failed: ${summary.failed}`)
      console.log(`   Skipped: ${summary.skipped}`)
      console.log(`   Duration: ${Math.round(summary.duration / 1000)}s`)
      
      // Save summary
      const summaryPath = path.join(process.cwd(), 'test-results', 'summary.json')
      fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2))
    }
  } catch (error) {
    console.log('⚠️ Test summary generation failed:', error.message)
  }
}

export default globalTeardown
