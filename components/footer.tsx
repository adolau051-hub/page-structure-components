'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [lockoutTime, setLockoutTime] = useState<number | null>(null)
  const router = useRouter()

  const handleAdminClick = () => {
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
    setIsModalOpen(true)
  }

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

      await new Promise(resolve => setTimeout(resolve, 500))
      setIsModalOpen(false)
      router.push('/staff/dashboard')
    } catch (err) {
      setError('An error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <>
      <footer className="bg-border text-foreground py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-serif font-bold mb-4 text-foreground">Riverstone Kitchen</h3>
              <p className="text-muted-foreground">
                Experience fine dining in an intimate, welcoming atmosphere.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-foreground">Hours</h4>
              <p className="text-muted-foreground">
                Tuesday – Thursday: 5:00 PM – 11:00 PM
                <br />
                Friday – Saturday: 5:00 PM – 11:30 PM
                <br />
                Sunday – Monday: Closed
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-foreground">Contact</h4>
              <p className="text-muted-foreground">
                Phone: +44 (0)20 1234 5678
                <br />
                Email: hello@riverstone-kitchen.co.uk
                <br />
                123 Marylebone Lane, London W1U 2QF
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-foreground">Follow Us</h4>
              <div className="flex gap-4">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Instagram
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Twitter (X)
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Facebook
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  TikTok
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-input pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground">&copy; 2026 Riverstone Kitchen. All rights reserved.</p>
            <button
              onClick={handleAdminClick}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
            >
              Admin Portal
            </button>
          </div>
        </div>
      </footer>

      {/* Admin Portal Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isLoading && setIsModalOpen(false)}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-card rounded-xl shadow-2xl border border-border overflow-hidden"
            >
              <div className="bg-gradient-to-r from-primary to-secondary px-6 py-6 flex items-center justify-between">
                <h2 className="text-xl font-serif font-bold text-white">Admin Portal</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  disabled={isLoading}
                  className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

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
