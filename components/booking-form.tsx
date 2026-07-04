'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Users, Sparkles, Wine } from 'lucide-react'

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
    <section id="booking" className="py-20 md:py-32 px-4 md:px-8 bg-card relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-primary blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-accent blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-accent font-semibold tracking-widest uppercase text-sm mb-3">
            Reservations
          </p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Reserve Your Table
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Secure your place at our table. Each booking is a personal invitation to experience the best of seasonal British cuisine.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="rounded-2xl overflow-hidden shadow-xl aspect-[4/3]">
              <img
                src="/chefs-table.png"
                alt="The Chef's Table at Riverstone Kitchen"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="bg-background border border-border rounded-xl p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 shrink-0">
                  <Sparkles className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-foreground mb-1">Seasonal Tasting</h3>
                  <p className="text-sm text-muted-foreground">A curated journey through the finest seasonal dishes. £65 per person.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 shrink-0">
                  <Wine className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-foreground mb-1">Chef&apos;s Table</h3>
                  <p className="text-sm text-muted-foreground">Intimate counter seating facing the kitchen. £130 per person.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 shrink-0">
                  <Users className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-foreground mb-1">The Hearth Table</h3>
                  <p className="text-sm text-muted-foreground">Communal dining by the fireplace. £75 per person.</p>
                </div>
              </div>
            </div>

            <blockquote className="border-l-2 border-accent pl-5 italic text-muted-foreground leading-relaxed">
              &ldquo;Every dish tells a story of the land, the season, and the hands that prepared it.&rdquo;
              <footer className="mt-2 not-italic text-sm font-semibold text-foreground">
                — Chef Julian Hartwell
              </footer>
            </blockquote>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-background border border-border rounded-lg p-4 flex items-center gap-3">
                <Calendar className="text-primary shrink-0" size={20} />
                <div>
                  <p className="font-semibold text-foreground">Advance booking</p>
                  <p className="text-muted-foreground">Up to 30 days ahead</p>
                </div>
              </div>
              <div className="bg-background border border-border rounded-lg p-4 flex items-center gap-3">
                <Clock className="text-primary shrink-0" size={20} />
                <div>
                  <p className="font-semibold text-foreground">Seating</p>
                  <p className="text-muted-foreground">5:00 PM – 11:00 PM</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="bg-background border border-border rounded-2xl p-6 md:p-8 shadow-lg space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                </div>
              </div>

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Time
                  </label>
                  {slots.length > 0 ? (
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
                  ) : (
                    <div className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg text-muted-foreground text-sm">
                      Select a date to see times
                    </div>
                  )}
                </div>
              </div>

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

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-secondary text-white font-semibold py-4 rounded-lg transition-colors disabled:opacity-50 text-lg"
              >
                {loading ? 'Processing...' : 'Complete Booking'}
              </motion.button>
              <p className="text-xs text-muted-foreground text-center">
                For groups larger than 6, please contact us directly at +44 (0)20 1234 5678
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
