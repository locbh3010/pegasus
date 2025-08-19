export const TEST_CONFIG = {
  // Base URLs
  BASE_URL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
  
  // Test user credentials
  TEST_USERS: {
    VALID_USER: {
      email: process.env.TEST_USER_EMAIL || 'test@example.com',
      password: process.env.TEST_USER_PASSWORD || 'TestPassword123!',
      username: 'testuser',
    },
    INVALID_USER: {
      email: 'invalid@example.com',
      password: 'wrongpassword',
    },
  },

  // OAuth test configuration
  OAUTH: {
    GOOGLE: {
      enabled: process.env.TEST_GOOGLE_OAUTH === 'true',
      testEmail: process.env.TEST_GOOGLE_EMAIL,
      testPassword: process.env.TEST_GOOGLE_PASSWORD,
    },
    GITHUB: {
      enabled: process.env.TEST_GITHUB_OAUTH === 'true',
      testUsername: process.env.TEST_GITHUB_USERNAME,
      testPassword: process.env.TEST_GITHUB_PASSWORD,
    },
  },

  // Timeouts
  TIMEOUTS: {
    SHORT: 5000,
    MEDIUM: 10000,
    LONG: 30000,
    OAUTH_CALLBACK: 15000,
    LOGOUT: 5000,
  },

  // Test data
  TEST_DATA: {
    NEW_USER: {
      email: `test-${Date.now()}@example.com`,
      password: 'NewUserPassword123!',
      username: `testuser${Date.now()}`,
    },
  },

  // Supabase test configuration
  SUPABASE: {
    TEST_MODE: process.env.NODE_ENV === 'test',
    PROJECT_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },

  // Visual regression testing
  VISUAL: {
    THRESHOLD: 0.2,
    ANIMATIONS: 'disabled' as const,
  },

  // Routes to test
  ROUTES: {
    HOME: '/',
    SIGN_IN: '/auth/signin',
    SIGN_UP: '/auth/signup',
    CALLBACK: '/auth/callback',
    CALLBACK_SIMPLE: '/auth/callback-simple',
    LOGOUT: '/auth/logout',
    DASHBOARD: '/dashboard',
    DASHBOARD_TASKS: '/dashboard/tasks',
    DASHBOARD_SETTINGS: '/dashboard/settings',
  },
} as const

export type TestUser = typeof TEST_CONFIG.TEST_USERS.VALID_USER
