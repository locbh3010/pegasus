'use client'

import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="mx-auto w-full max-w-md p-6">
                <div className="rounded-lg bg-white p-8 text-center shadow-lg">
                    <h2 className="mb-4 text-2xl font-bold text-gray-900">Something went wrong!</h2>
                    <p className="mb-6 text-gray-600">
                        An unexpected error occurred. Please try again.
                    </p>
                    <button
                        onClick={reset}
                        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                    >
                        Try again
                    </button>
                </div>
            </div>
        </div>
    )
}
