'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const experiences = [
  {
    id: 'seasonal-tasting',
    name: 'Seasonal Tasting',
    price: 65,
    description: "A curated selection of the season's finest dishes",
    image: '/seasonal-tasting.png',
  },
  {
    id: 'chefs-table',
    name: "Chef's Table",
    price: 130,
    description: 'Intimate experience at the kitchen counter with Chef Julian',
    image: '/chefs-table.png',
  },
  {
    id: 'hearth-table',
    name: 'The Hearth Table',
    price: 75,
    description: 'Communal dining by the fireplace with other guests',
    image: '/hearth-table.png',
  },
  {
    id: 'walk-in',
    name: 'Walk-In Dining',
    price: 0,
    description: 'Casual walk-ins welcome - dine à la carte from our full menu',
    image: '/walk-in-dining.png',
  },
]

export function Experiences() {
  return (
    <section className="py-20 md:py-32 px-4 md:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Our Experiences
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose the perfect dining experience for your evening
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative w-full aspect-video mb-6 overflow-hidden rounded-lg">
                <Image
                  src={exp.image}
                  alt={exp.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority={index === 0}
              </div>
              <h3 className="text-2xl font-serif font-bold text-foreground mb-2">
                {exp.name}
              </h3>
              <p className="text-muted-foreground mb-4">{exp.description}</p>
              <p className="text-2xl font-bold text-primary">
                {exp.price === 0 ? 'Free' : `£${exp.price}`}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
