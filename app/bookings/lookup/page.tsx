'use client'

import { useState } from 'react'
import { Footer } from '@/components/footer'

export default function BookingLookup() {
  const [email, setEmail] = useState('')
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setBooking(null)
    setSearched(false)

    try {
      const response = await fetch('/api/bookings/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Booking not found')
      } else {
        setBooking(data.booking)
      }
    } catch (err) {
      setError('Failed to lookup booking')
    } finally {
      setLoading(false)
      setSearched(true)
    }
  }

  const handleCancel = async () => {
    if (!booking || !window.confirm('Are you sure you want to cancel this booking?')) {
      return
    }

    try {
      const response = await fetch('/api/bookings/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id,
          email: booking.customer_email,
        }),
      })

      if (response.ok) {
        setError('')
        setBooking(null)
        alert('Booking cancelled successfully')
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to cancel booking')
      }
    } catch (err) {
      setError('Failed to cancel booking')
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="py-20 px-4 md:px-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Manage Your Booking
          </h1>
          <p className="text-lg text-muted-foreground mb-12">
            View or cancel your reservation
          </p>

          <form onSubmit={handleSearch} className="space-y-6 mb-12">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-secondary text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Find Booking'}
            </button>
          </form>

          {searched && error && (
            <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-8">
              {error}
            </div>
          )}

          {booking && (
            <div className="bg-card border border-border rounded-lg p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
                  Your Booking Details
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Name</p>
                  <p className="font-semibold text-foreground">{booking.customer_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Party Size</p>
                  <p className="font-semibold text-foreground">{booking.party_size} people</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Date</p>
                  <p className="font-semibold text-foreground">
                    {new Date(booking.booking_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Time</p>
                  <p className="font-semibold text-foreground">{booking.booking_time}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Experience</p>
                <p className="font-semibold text-foreground">{booking.experiences?.name}</p>
              </div>

              {booking.dietary_restrictions && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Dietary Restrictions</p>
                  <p className="text-foreground">{booking.dietary_restrictions}</p>
                </div>
              )}

              {booking.special_notes && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Special Notes</p>
                  <p className="text-foreground">{booking.special_notes}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <p className="font-semibold text-foreground capitalize">{booking.status}</p>
              </div>

              {booking.status === 'confirmed' && (
                <button
                  onClick={handleCancel}
                  className="w-full bg-destructive hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
