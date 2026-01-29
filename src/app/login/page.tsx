"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login, setToken } from '@/lib/client/authClient'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const res = await login(email, password)
    setLoading(false)
    if (res?.error) return setError(res.error)
    if (res?.token) {
      setToken(res.token)
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl mb-4">Log in</h1>

        {error && <div className="text-red-600 mb-2">{error}</div>}

        <label className="block mb-2">Email</label>
        <input className="w-full mb-4 p-2 border" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label className="block mb-2">Password</label>
        <input type="password" className="w-full mb-4 p-2 border" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button className="w-full bg-blue-600 text-white p-2" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
      </form>
    </div>
  )
}
