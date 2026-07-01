'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, User, Loader, ArrowLeft } from 'lucide-react'
import { Footer } from '@/components/footer'

export default function StaffLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [lockoutTime, setLockoutTime] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    const lockoutData = localStorage.getItem('admin_lockout')
    if (lockoutData) {
      const lockoutExpire = parseInt(lockoutData)
      const now = Date.now()
      if (now < lockoutExpire) {
        setLockoutTime(Math.ceil((lockoutExpire - now) / 1000))
      } else {
        localStorage.removeItem('admin_lockout')
        localStorage.removeItem('admin_failed_attempts')
      }
    }
  }, [])

  useEffect(() => {
    if (lockoutTime === null) return
    if (lockoutTime <= 0) {
      setLockoutTime(null)
      localStorage.removeItem('admin_lockout')
      localStorage.removeItem('admin_failed_attempts')
      return
    }
    const timer = setInterval(() => {
      setLockoutTime((prev) => (prev !== null ? prev - 1 : null))
    }, 1000)
    return () => clearInterval(timer)
  }, [lockoutTime])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (lockoutTime !== null && lockoutTime > 0) {
      setError(`Account locked. Please wait ${lockoutTime} seconds.`)
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/staff/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, username }),
      })

      const data = await response.json()

      if (!response.ok) {
        const failedAttempts = parseInt(localStorage.getItem('admin_failed_attempts') || '0')
        const newFailedAttempts = failedAttempts + 1

        if (newFailedAttempts >= 3) {
          const lockoutEndTime = Date.now() + 60 * 60 * 1000
          localStorage.setItem('admin_lockout', lockoutEndTime.toString())
          localStorage.setItem('admin_failed_attempts', '0')
          setLockoutTime(3600)
          setError('Too many failed attempts. Please wait 1 hour before trying again.')
        } else {
          localStorage.setItem('admin_failed_attempts', newFailedAttempts.toString())
          const remaining = 3 - newFailedAttempts
          setError(`${data.error || 'Invalid credentials'}. ${remaining} attempts remaining.`)
        }
        setIsLoading(false)
        return
      }

      localStorage.removeItem('admin_failed_attempts')
      localStorage.removeItem('admin_lockout')

      await new Promise((resolve) => setTimeout(resolve, 500))
      router.push('/staff/dashboard')
    } catch (err) {
      setError('An error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <a
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Back to site
          </a>

          <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-secondary px-6 py-8 text-center">
              <h1 className="text-2xl font-serif font-bold text-white">Admin Portal</h1>
              <p className="text-white/80 text-sm mt-1">Riverstone Kitchen Staff</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {lockoutTime !== null && lockoutTime > 0 ? (
                <div className="p-4 bg-red-100 border border-red-300 rounded-lg text-center">
                  <p className="text-red-800 font-semibold">Account locked</p>
                  <p className="text-red-700 text-sm mt-1">
                    Please wait {lockoutTime} seconds before trying again
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                        className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-red-800 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-secondary text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="animate-spin" size={18} />
                        Logging in...
                      </>
                    ) : (
                      'Log In'
                    )}
                  </button>
                </>
              )}
            </form>
          </div>
        </motion.div>
      </div>
      <Footer />
    </main>
  )
}
