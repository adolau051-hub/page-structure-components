'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export function BookingForm() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [slots, setSlots] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    partySize: '2',
    experience: 'seasonal-tasting',
    date: '',
    time: '',
    dietaryRestrictions: '',
    specialNotes: '',
  })

  // Fetch available slots when date changes
  useEffect(() => {
    if (!formData.date || !formData.experience) return

    const fetchSlots = async () => {
      try {
        const response = await fetch('/api/bookings/availability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: formData.date,
            experienceId: formData.experience,
          }),
        })
        const data = await response.json()
        if (data.slots) {
          setSlots(data.slots.filter((s: any) => s.available).map((s: any) => s.time))
        }
      } catch (error) {
        console.error('Failed to fetch slots:', error)
      }
    }

    fetchSlots()
  }, [formData.date, formData.experience])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Booking failed')
      }

      setMessage('Booking confirmed! Check your email for details.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        partySize: '2',
        experience: 'seasonal-tasting',
        date: '',
        time: '',
        dietaryRestrictions: '',
        specialNotes: '',
      })
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Booking failed')
    } finally {
      setLoading(false)
    }
  }

  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  const getMaxDate = () => {
    const max = new Date()
    max.setDate(max.getDate() + 30)
    return max.toISOString().split('T')[0]
  }

  return (
    <section id="booking" className="py-20 md:py-32 px-4 md:px-8 bg-card">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto"
      >
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-center mb-12 text-foreground">
          Reserve Your Table
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Experience
            </label>
            <select
              value={formData.experience}
              onChange={(e) =>
                setFormData({ ...formData, experience: e.target.value })
              }
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="seasonal-tasting">Seasonal Tasting - £65</option>
              <option value="chefs-table">Chef&apos;s Table - £130</option>
              <option value="hearth-table">The Hearth Table - £75</option>
            </select>
          </div>

          {/* Party Size */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Party Size
            </label>
            <select
              value={formData.partySize}
              onChange={(e) =>
                setFormData({ ...formData, partySize: e.target.value })
              }
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {[1, 2, 3, 4, 5, 6].map((size) => (
                <option key={size} value={size}>
                  {size} {size === 1 ? 'person' : 'people'}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground mt-1">
              For groups larger than 6, please contact us directly
            </p>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Date
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value, time: '' })}
              min={getMinDate()}
              max={getMaxDate()}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Time */}
          {slots.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Time
              </label>
              <select
                required
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select a time</option>
                {slots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Dietary Restrictions */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Dietary Restrictions (Optional)
            </label>
            <textarea
              value={formData.dietaryRestrictions}
              onChange={(e) =>
                setFormData({ ...formData, dietaryRestrictions: e.target.value })
              }
              placeholder="Let us know about allergies or dietary preferences"
              rows={2}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Special Notes */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Special Notes (Optional)
            </label>
            <textarea
              value={formData.specialNotes}
              onChange={(e) =>
                setFormData({ ...formData, specialNotes: e.target.value })
              }
              placeholder="Any special occasions or requests?"
              rows={2}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Message */}
          {message && (
            <div
              className={`p-4 rounded-lg ${
                message.includes('confirmed')
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {message}
            </div>
          )}

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-secondary text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Complete Booking'}
          </motion.button>
        </form>
      </motion.div>
    </section>
  )
}
