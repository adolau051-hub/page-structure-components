'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Booking {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  party_size: number
  booking_date: string
  booking_time: string
  status: string
  special_notes?: string
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Small delay to ensure cookie is available
    const timer = setTimeout(async () => {
      async function fetchBookings() {
        try {
          const response = await fetch('/api/staff/bookings', {
            credentials: 'include',
          })
          
          if (!response.ok) {
            if (response.status === 401) {
              router.push('/')
              return
            }
            throw new Error('Failed to fetch bookings')
          }
          
          const data = await response.json()
          setBookings(data.bookings || [])
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
          setIsLoading(false)
        }
      }

      fetchBookings()
    }, 300)

    return () => clearTimeout(timer)
  }, [router])

  async function handleLogout() {
    await fetch('/api/staff/logout', { method: 'POST' })
    router.push('/')
  }

  async function updateBookingStatus(bookingId: string, newStatus: string) {
    try {
      const response = await fetch('/api/staff/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update booking')
      }

      // Refresh bookings
      const refreshResponse = await fetch('/api/staff/bookings')
      const data = await refreshResponse.json()
      setBookings(data.bookings || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-serif font-bold text-foreground">
            Riverstone Kitchen - Bookings
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-secondary text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
          >
            Log Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No bookings found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Date & Time
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Party Size
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-foreground">
                      {booking.customer_name}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {new Date(booking.booking_date).toLocaleDateString()} at{' '}
                      {booking.booking_time}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {booking.party_size}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      <div>{booking.customer_email}</div>
                      <div>{booking.customer_phone}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : booking.status === 'arrived'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 space-x-2">
                      {booking.status === 'confirmed' && (
                        <>
                          <button
                            onClick={() =>
                              updateBookingStatus(booking.id, 'arrived')
                            }
                            className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
                          >
                            Arrived
                          </button>
                          <button
                            onClick={() =>
                              updateBookingStatus(booking.id, 'no_show')
                            }
                            className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded hover:opacity-90 transition-opacity"
                          >
                            No Show
                          </button>
                          <button
                            onClick={() =>
                              updateBookingStatus(booking.id, 'cancelled')
                            }
                            className="px-2 py-1 text-xs bg-destructive text-destructive-foreground rounded hover:opacity-90 transition-opacity"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
