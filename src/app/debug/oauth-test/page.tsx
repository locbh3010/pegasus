'use client'

/* eslint-disable no-console */
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function OAuthTestPage() {
  const [logs, setLogs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`])
    console.log(message)
  }

  const clearLogs = () => {
    setLogs([])
  }

  const testGoogleOAuth = async () => {
    setIsLoading(true)
    addLog('🔥 Starting Google OAuth test...')

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) {
        addLog(`❌ Google OAuth error: ${error.message}`)
      } else {
        addLog('✅ Google OAuth initiated successfully')
        addLog(`🔗 Redirect URL: ${data.url}`)
      }
    } catch (error) {
      addLog(`❌ Google OAuth exception: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testGitHubOAuth = async () => {
    setIsLoading(true)
    addLog('🔥 Starting GitHub OAuth test...')

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        addLog(`❌ GitHub OAuth error: ${error.message}`)
      } else {
        addLog('✅ GitHub OAuth initiated successfully')
        addLog(`🔗 Redirect URL: ${data.url}`)
      }
    } catch (error) {
      addLog(`❌ GitHub OAuth exception: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testCallbackSimple = async () => {
    setIsLoading(true)
    addLog('🔥 Testing callback-simple endpoint...')

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback-simple`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) {
        addLog(`❌ Callback-simple OAuth error: ${error.message}`)
      } else {
        addLog('✅ Callback-simple OAuth initiated successfully')
        addLog(`🔗 Redirect URL: ${data.url}`)
      }
    } catch (error) {
      addLog(`❌ Callback-simple OAuth exception: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const checkCurrentSession = async () => {
    addLog('🔥 Checking current session...')

    try {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        addLog(`❌ Session check error: ${error.message}`)
      } else if (data.session?.user) {
        addLog(`✅ Active session found: ${data.session.user.id}`)
        addLog(`📧 User email: ${data.session.user.email}`)
        addLog(
          `⏰ Expires at: ${data.session.expires_at ? new Date(data.session.expires_at * 1000).toLocaleString() : 'N/A'}`
        )
      } else {
        addLog('❌ No active session found')
      }
    } catch (error) {
      addLog(`❌ Session check exception: ${error}`)
    }
  }

  const checkCookies = () => {
    addLog('🍪 Checking cookies...')

    if (typeof document !== 'undefined') {
      const allCookies = document.cookie
      const cookieArray = allCookies.split(';').map((c) => c.trim())
      const sbCookies = cookieArray.filter((c) => c.startsWith('sb-'))

      addLog(`🍪 Total cookies: ${cookieArray.length}`)
      addLog(`🍪 Supabase cookies: ${sbCookies.length}`)

      if (sbCookies.length > 0) {
        sbCookies.forEach((cookie) => {
          const [name] = cookie.split('=')
          addLog(`🍪 Found: ${name}`)
        })
      } else {
        addLog('🍪 No Supabase cookies found')
      }
    }
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="mb-4 text-2xl font-bold">OAuth Testing & Debugging</h1>
        <p className="mb-4 text-gray-600">Test OAuth flows and debug authentication issues</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* OAuth Tests */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">OAuth Tests</h2>
          <div className="space-y-3">
            <Button
              onClick={testGoogleOAuth}
              disabled={isLoading}
              className="w-full"
              variant="outline"
            >
              Test Google OAuth (/auth/callback)
            </Button>

            <Button
              onClick={testGitHubOAuth}
              disabled={isLoading}
              className="w-full"
              variant="outline"
            >
              Test GitHub OAuth (/auth/callback)
            </Button>

            <Button
              onClick={testCallbackSimple}
              disabled={isLoading}
              className="w-full"
              variant="outline"
            >
              Test Google OAuth (/auth/callback-simple)
            </Button>
          </div>
        </div>

        {/* Debug Tools */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">Debug Tools</h2>
          <div className="space-y-3">
            <Button onClick={checkCurrentSession} className="w-full" variant="outline">
              Check Current Session
            </Button>

            <Button onClick={checkCookies} className="w-full" variant="outline">
              Check Cookies
            </Button>

            <Button onClick={clearLogs} className="w-full" variant="destructive">
              Clear Logs
            </Button>
          </div>
        </div>
      </div>

      {/* Logs */}
      <div className="mt-6 rounded-lg bg-gray-900 p-4 text-green-400">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Debug Logs</h3>
          <span className="text-sm text-gray-400">{logs.length} entries</span>
        </div>

        <div className="h-96 overflow-y-auto font-mono text-sm">
          {logs.length === 0 ? (
            <div className="text-gray-500 italic">No logs yet. Run a test to see debug output.</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="mb-1">
                {log}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-blue-50 p-4">
        <h3 className="mb-2 font-semibold text-blue-800">How to Debug OAuth Issues:</h3>
        <ol className="list-inside list-decimal space-y-1 text-sm text-blue-700">
          <li>Click &quot;Check Current Session&quot; to see if you&apos;re already logged in</li>
          <li>Click &quot;Check Cookies&quot; to verify cookie storage is working</li>
          <li>Try an OAuth test - watch the logs for detailed flow information</li>
          <li>If redirected to callback, check browser console for detailed logs</li>
          <li>Visit /debug/auth-storage for real-time storage monitoring</li>
        </ol>
      </div>
    </div>
  )
}
