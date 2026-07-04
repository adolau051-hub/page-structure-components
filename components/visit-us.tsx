'use client'

import { motion } from 'framer-motion'
import { MapPin, Clock, Phone, Mail } from 'lucide-react'

const hours = [
  { day: 'Tuesday – Thursday', time: '5:00 PM – 11:00 PM' },
  { day: 'Friday – Saturday', time: '5:00 PM – 11:30 PM' },
  { day: 'Sunday – Monday', time: 'Closed' },
]

export function VisitUs() {
  return (
    <section id="visit" className="py-20 md:py-32 px-4 md:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-accent font-semibold tracking-widest uppercase text-sm mb-3">
            Find Us
          </p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
            Visit Riverstone Kitchen
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-card border border-border rounded-xl p-8 text-center"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-5">
              <MapPin className="text-primary" size={26} />
            </div>
            <h3 className="text-lg font-serif font-bold text-foreground mb-3">
              Our Address
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              123 Marylebone Lane<br />
              London W1U 2QF<br />
              United Kingdom
            </p>
            <a
              href="https://maps.google.com/?q=123+Marylebone+Lane+London+W1U+2QF"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-primary hover:text-accent font-semibold text-sm transition-colors"
            >
              Get directions &rarr;
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-card border border-border rounded-xl p-8 text-center"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-5">
              <Clock className="text-primary" size={26} />
            </div>
            <h3 className="text-lg font-serif font-bold text-foreground mb-3">
              Opening Hours
            </h3>
            <div className="space-y-2">
              {hours.map((h) => (
                <div key={h.day} className="text-sm">
                  <span className="text-foreground font-medium">{h.day}</span>
                  <br />
                  <span className="text-muted-foreground">{h.time}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-card border border-border rounded-xl p-8 text-center"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-5">
              <Phone className="text-primary" size={26} />
            </div>
            <h3 className="text-lg font-serif font-bold text-foreground mb-3">
              Reservations
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-2">
              <a href="tel:+442012345678" className="hover:text-primary transition-colors">
                +44 (0)20 1234 5678
              </a>
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <a href="mailto:hello@riverstone-kitchen.co.uk" className="hover:text-primary transition-colors inline-flex items-center gap-2">
                <Mail size={16} />
                hello@riverstone-kitchen.co.uk
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
