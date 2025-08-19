/* eslint-disable no-console */
// Debug utility for OAuth troubleshooting
export const debugOAuth = {
  logToServer: async (message: string, data?: unknown) => {
    try {
      // Send debug info to server endpoint
      await fetch('/api/debug', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          data,
          timestamp: new Date().toISOString(),
          url: window.location.href,
        }),
      })
    } catch (error) {
      console.error('Failed to send debug log to server:', error)
    }
  },

  logOAuthCallback: (step: string, data?: unknown) => {
    const logMessage = `🔥 OAuth Callback - ${step}`
    console.log(logMessage, data)

    // Also log to server if needed
    if (typeof window !== 'undefined') {
      debugOAuth.logToServer(logMessage, data)
    }
  },

  logSessionState: (session: unknown, error: unknown) => {
    console.log('🔥 Session State:', {
      hasSession: !!session,
      hasUser: !!(session as { user?: unknown })?.user,
      hasError: !!error,
      sessionExpiry: (session as { expires_at?: string })?.expires_at,
      error: (error as { message?: string })?.message,
    })
  },

  logURLParams: () => {
    console.log('🔥 URL Analysis:', {
      href: window.location.href,
      hash: window.location.hash,
      search: window.location.search,
      hasAccessToken: window.location.hash.includes('access_token'),
      hasCode: window.location.search.includes('code='),
      hasError: window.location.search.includes('error='),
    })
  },
}
