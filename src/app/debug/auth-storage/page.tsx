'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import Cookies from 'js-cookie'
import type { Session } from '@supabase/supabase-js'

export default function AuthStorageDebugPage() {
  const [localStorageData, setLocalStorageData] = useState<Record<string, string>>({})
  const [cookieData, setCookieData] = useState<Record<string, string>>({})
  const [sessionData, setSessionData] = useState<Session | null>(null)

  const refreshData = () => {
    // Check localStorage
    const localData: Record<string, string> = {}
    if (typeof window !== 'undefined') {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && (key.includes('supabase') || key.includes('auth'))) {
          localData[key] = localStorage.getItem(key) || ''
        }
      }
    }
    setLocalStorageData(localData)

    // Check cookies
    const allCookies = Cookies.get()
    const authCookies: Record<string, string> = {}
    Object.keys(allCookies).forEach((key) => {
      if (key.includes('supabase') || key.includes('auth') || key.startsWith('sb-')) {
        authCookies[key] = allCookies[key] || ''
      }
    })
    setCookieData(authCookies)

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessionData(session)
    })
  }

  useEffect(() => {
    refreshData()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      refreshData()
    })

    return () => subscription.unsubscribe()
  }, [])

  const clearAllAuthData = () => {
    // Clear localStorage
    if (typeof window !== 'undefined') {
      Object.keys(localStorageData).forEach((key) => {
        localStorage.removeItem(key)
      })
    }

    // Clear cookies
    Object.keys(cookieData).forEach((key) => {
      Cookies.remove(key, { path: '/' })
    })

    // Sign out from Supabase
    supabase.auth.signOut()

    refreshData()
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="mb-4 text-2xl font-bold">Auth Storage Debug</h1>
        <div className="flex gap-4">
          <button
            onClick={refreshData}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Refresh Data
          </button>
          <button
            onClick={clearAllAuthData}
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Clear All Auth Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Current Session */}
        <div className="rounded-lg bg-gray-50 p-4">
          <h2 className="mb-3 text-lg font-semibold text-green-600">Current Session</h2>
          {sessionData ? (
            <div className="space-y-2">
              <div>
                <strong>User ID:</strong> {sessionData?.user?.id}
              </div>
              <div>
                <strong>Email:</strong> {sessionData?.user?.email || 'N/A'}
              </div>
              <div>
                <strong>Expires At:</strong>{' '}
                {sessionData?.expires_at
                  ? new Date(sessionData.expires_at * 1000).toLocaleString()
                  : 'N/A'}
              </div>
              <div>
                <strong>Token Type:</strong> {sessionData?.token_type || 'N/A'}
              </div>
              <details className="mt-2">
                <summary className="cursor-pointer font-medium">
                  Access Token (click to expand)
                </summary>
                <pre className="mt-1 overflow-auto rounded bg-gray-100 p-2 text-xs">
                  {sessionData?.access_token?.substring(0, 100) || 'N/A'}...
                </pre>
              </details>
            </div>
          ) : (
            <p className="text-gray-500">No active session</p>
          )}
        </div>

        {/* Cookies */}
        <div className="rounded-lg bg-gray-50 p-4">
          <h2 className="mb-3 text-lg font-semibold text-blue-600">Cookies (Recommended)</h2>
          {Object.keys(cookieData).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(cookieData).map(([key, value]) => (
                <div key={key} className="border-b pb-2">
                  <div className="text-sm font-medium">{key}</div>
                  <div className="text-xs break-all text-gray-600">
                    {value.length > 50 ? `${value.substring(0, 50)}...` : value}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No auth cookies found</p>
          )}
        </div>

        {/* LocalStorage */}
        <div className="rounded-lg bg-gray-50 p-4">
          <h2 className="mb-3 text-lg font-semibold text-orange-600">LocalStorage (Legacy)</h2>
          {Object.keys(localStorageData).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(localStorageData).map(([key, value]) => (
                <div key={key} className="border-b pb-2">
                  <div className="text-sm font-medium">{key}</div>
                  <div className="text-xs break-all text-gray-600">
                    {value.length > 50 ? `${value.substring(0, 50)}...` : value}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No auth data in localStorage</p>
          )}
        </div>

        {/* Storage Comparison */}
        <div className="rounded-lg bg-gray-50 p-4">
          <h2 className="mb-3 text-lg font-semibold text-purple-600">Storage Comparison</h2>
          <div className="space-y-3 text-sm">
            <div>
              <strong className="text-blue-600">Cookies:</strong>
              <ul className="ml-2 list-inside list-disc text-gray-600">
                <li>Secure (HttpOnly, Secure flags)</li>
                <li>Automatic server-side access</li>
                <li>CSRF protection with SameSite</li>
                <li>Automatic expiration</li>
              </ul>
            </div>
            <div>
              <strong className="text-orange-600">LocalStorage:</strong>
              <ul className="ml-2 list-inside list-disc text-gray-600">
                <li>Vulnerable to XSS attacks</li>
                <li>Client-side only</li>
                <li>Manual cleanup required</li>
                <li>Larger storage capacity</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-blue-50 p-4">
        <h3 className="mb-2 font-semibold text-blue-800">Current Configuration</h3>
        <p className="text-sm text-blue-700">
          ✅ Your app is now configured to use <strong>cookie storage</strong> for authentication
          tokens. This provides better security compared to localStorage.
        </p>
        <div className="mt-2 text-xs text-blue-600">
          <strong>Cookie Settings:</strong>
          <ul className="ml-2 list-inside list-disc">
            <li>Expires: 7 days</li>
            <li>Path: /</li>
            <li>
              Secure: {process.env.NODE_ENV === 'production' ? 'true' : 'false'} (production only)
            </li>
            <li>SameSite: lax</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
