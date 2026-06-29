'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export function AdminPortal() {
  const [isOpen, setIsOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [lockoutTime, setLockoutTime] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if admin is locked out
    const lockoutData = localStorage.getItem('admin_lockout')
    if (lockoutData) {
      const lockoutExpire = parseInt(lockoutData)
      const now = Date.now()
      if (now < lockoutExpire) {
        const remainingTime = Math.ceil((lockoutExpire - now) / 1000)
        setLockoutTime(remainingTime)
      } else {
        localStorage.removeItem('admin_lockout')
        localStorage.removeItem('admin_failed_attempts')
      }
    }
  }, [isOpen])

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

  async function handleLogin(e: React.FormEvent) {
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
        // Handle failed login attempts
        const failedAttempts = parseInt(localStorage.getItem('admin_failed_attempts') || '0')
        const newFailedAttempts = failedAttempts + 1

        if (newFailedAttempts >= 3) {
          const lockoutEndTime = Date.now() + 60 * 60 * 1000 // 1 hour
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

      // Clear failed attempts on success
      localStorage.removeItem('admin_failed_attempts')
      localStorage.removeItem('admin_lockout')

      // Wait a moment for cookie to be set before redirecting
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Redirect to admin dashboard
      setIsOpen(false)
      router.push('/staff/dashboard')
    } catch (err) {
      setError('An error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Portal Button - Bottom Right Corner */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-serif font-bold text-lg shadow-lg hover:opacity-90 transition-opacity"
        title="Admin Portal"
      >
        ⚙️
      </motion.button>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isLoading && setIsOpen(false)}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-card rounded-xl shadow-2xl border border-border overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary to-secondary px-6 py-6 flex items-center justify-between">
                <h2 className="text-xl font-serif font-bold text-white">Admin Portal</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  disabled={isLoading}
                  className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <form onSubmit={handleLogin} className="p-6 space-y-4">
                {lockoutTime !== null && lockoutTime > 0 ? (
                  <div className="p-4 bg-red-100 border border-red-300 rounded-lg text-center">
                    <p className="text-red-800 font-semibold">
                      Account locked due to too many failed attempts
                    </p>
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
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        disabled={isLoading}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        disabled={isLoading}
                        required
                      />
                    </div>

                    {error && (
                      <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-red-800 text-sm">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-primary hover:bg-secondary text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isLoading ? 'Logging in...' : 'Log In'}
                    </button>
                  </>
                )}
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
