'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LogOut, Calendar, Clock, Users, Mail, Phone, Loader, UtensilsCrossed } from 'lucide-react'
import { Footer } from '@/components/footer'

interface Booking {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  party_size: number
  booking_date: string
  booking_time: string
  status: string
  special_notes: string | null
  dietary_restrictions: string | null
  experiences: { name: string; price_gbp: number } | null
}

type StatusFilter = 'all' | 'confirmed' | 'arrived' | 'no_show' | 'cancelled'

const STATUS_LABELS: Record<string, string> = {
  confirmed: 'Confirmed',
  arrived: 'Arrived',
  no_show: 'No Show',
  cancelled: 'Cancelled',
}

const STATUS_COLORS: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-800 border-green-300',
  arrived: 'bg-blue-100 text-blue-800 border-blue-300',
  no_show: 'bg-amber-100 text-amber-800 border-amber-300',
  cancelled: 'bg-red-100 text-red-800 border-red-300',
}

export default function StaffDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const router = useRouter()

  const fetchBookings = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/staff/bookings')
      if (response.status === 401) {
        router.push('/staff/login')
        return
      }
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to fetch bookings')
      }
      const data = await response.json()
      setBookings(data.bookings || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  async function handleLogout() {
    try {
      await fetch('/api/staff/logout', { method: 'POST' })
    } catch (err) {
      // ignore
    }
    router.push('/staff/login')
  }

  async function updateStatus(bookingId: string, status: string) {
    setUpdatingId(bookingId)
    try {
      const response = await fetch('/api/staff/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, status }),
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update booking')
      }
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update booking')
    } finally {
      setUpdatingId(null)
    }
  }

  const filteredBookings =
    statusFilter === 'all'
      ? bookings
      : bookings.filter((b) => b.status === statusFilter)

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    arrived: bookings.filter((b) => b.status === 'arrived').length,
    no_show: bookings.filter((b) => b.status === 'no_show').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 px-4 md:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground flex items-center gap-3">
                <UtensilsCrossed className="text-primary" />
                Staff Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage reservations at Riverstone Kitchen
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 bg-card border border-border hover:bg-muted text-foreground px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              <LogOut size={18} />
              Log Out
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[
              { label: 'Total', value: stats.total, color: 'text-foreground' },
              { label: 'Confirmed', value: stats.confirmed, color: 'text-green-600' },
              { label: 'Arrived', value: stats.arrived, color: 'text-blue-600' },
              { label: 'No Show', value: stats.no_show, color: 'text-amber-600' },
              { label: 'Cancelled', value: stats.cancelled, color: 'text-red-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-card border border-border rounded-lg p-4">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {(['all', 'confirmed', 'arrived', 'no_show', 'cancelled'] as StatusFilter[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${
                  statusFilter === filter
                    ? 'bg-primary text-white'
                    : 'bg-card border border-border text-foreground hover:bg-muted'
                }`}
              >
                {filter === 'all' ? 'All' : STATUS_LABELS[filter]}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-100 border border-red-300 text-red-800 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader className="animate-spin text-primary" size={32} />
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-12 text-center">
              <p className="text-muted-foreground">No bookings found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card border border-border rounded-lg p-5"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Customer</p>
                        <p className="font-semibold text-foreground">{booking.customer_name}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Mail size={12} /> {booking.customer_email}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone size={12} /> {booking.customer_phone}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Reservation</p>
                        <p className="text-foreground flex items-center gap-1">
                          <Calendar size={14} className="text-primary" />
                          {new Date(booking.booking_date).toLocaleDateString('en-GB', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                        <p className="text-foreground flex items-center gap-1">
                          <Clock size={14} className="text-primary" />
                          {booking.booking_time}
                        </p>
                        <p className="text-foreground flex items-center gap-1">
                          <Users size={14} className="text-primary" />
                          {booking.party_size} {booking.party_size === 1 ? 'guest' : 'guests'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-start lg:items-end gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_COLORS[booking.status] || 'bg-muted text-foreground border-border'}`}
                      >
                        {STATUS_LABELS[booking.status] || booking.status}
                      </span>
                      {booking.experiences && (
                        <p className="text-sm text-muted-foreground">
                          {booking.experiences.name}
                        </p>
                      )}
                      {booking.dietary_restrictions && (
                        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded">
                          Dietary: {booking.dietary_restrictions}
                        </p>
                      )}
                      {booking.special_notes && (
                        <p className="text-xs text-muted-foreground italic max-w-xs">
                          &ldquo;{booking.special_notes}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => updateStatus(booking.id, 'arrived')}
                        disabled={updatingId === booking.id}
                        className="px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                      >
                        Mark Arrived
                      </button>
                    )}
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => updateStatus(booking.id, 'no_show')}
                        disabled={updatingId === booking.id}
                        className="px-3 py-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors disabled:opacity-50"
                      >
                        Mark No Show
                      </button>
                    )}
                    {(booking.status === 'confirmed' || booking.status === 'arrived') && (
                      <button
                        onClick={() => updateStatus(booking.id, 'cancelled')}
                        disabled={updatingId === booking.id}
                        className="px-3 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                      >
                        Cancel Booking
                      </button>
                    )}
                    {updatingId === booking.id && (
                      <Loader className="animate-spin text-muted-foreground" size={16} />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}
