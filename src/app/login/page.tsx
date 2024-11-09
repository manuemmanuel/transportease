'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 p-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-gray-700/50 hover:border-[#AAFF30]/20 transition-all duration-300 shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold bg-gradient-to-r from-[#AAFF30] to-green-400 bg-clip-text text-transparent">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Welcome back
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
          {error && (
            <div className="bg-red-900/50 border border-red-500/50 text-red-200 p-4 rounded-2xl text-sm backdrop-blur-sm">
              {error}
            </div>
          )}
          <div className="rounded-2xl space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-3 bg-gray-700/30 border border-gray-600/50 rounded-xl
                          text-gray-100 placeholder-gray-400
                          focus:outline-none focus:ring-2 focus:ring-[#AAFF30]/20 focus:border-[#AAFF30]
                          hover:border-[#AAFF30]/20 transition-all duration-300"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 bg-gray-700/30 border border-gray-600/50 rounded-xl
                          text-gray-100 placeholder-gray-400
                          focus:outline-none focus:ring-2 focus:ring-[#AAFF30]/20 focus:border-[#AAFF30]
                          hover:border-[#AAFF30]/20 transition-all duration-300"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent 
                        text-sm font-medium rounded-full text-gray-900 bg-[#AAFF30] 
                        hover:bg-[#99ee20] focus:outline-none 
                        disabled:bg-[#AAFF30]/50 disabled:cursor-not-allowed
                        transform hover:scale-[1.02] active:scale-[0.98]
                        shadow-lg hover:shadow-[#AAFF30]/20
                        transition-all duration-300"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link 
              href="/forgot-password" 
              className="text-sm text-[#AAFF30] hover:text-[#99ee20] transition-colors duration-200
                       hover:underline decoration-2 underline-offset-4"
            >
              Forgot your password?
            </Link>
            <Link 
              href="/" 
              className="text-sm text-[#AAFF30] hover:text-[#99ee20] transition-colors duration-200
                       hover:underline decoration-2 underline-offset-4"
            >
              Create account
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
} 