'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'

const menuItems = {
  starters: [
    {
      name: 'Amuse Bouche',
      description: 'Chef&apos;s seasonal selection',
      price: '£8',
      image: '/menu/amuse-bouche.png',
    },
    {
      name: 'Foie Gras Terrine',
      description: 'With brioche and fig compote',
      price: '£16',
      image: '/menu/foie-gras.png',
    },
    {
      name: 'Burrata & Heirloom Tomatoes',
      description: 'Fresh buffalo mozzarella, aged balsamic',
      price: '£12',
      image: '/menu/burrata.png',
    },
  ],
  mains: [
    {
      name: 'Herb-Roasted Duck Breast',
      description: 'Cherry gastrique, seasonal vegetables',
      price: '£28',
      image: '/menu/duck-breast.png',
    },
    {
      name: 'Pan-Seared Halibut',
      description: 'Beurre blanc, asparagus, new potatoes',
      price: '£32',
      image: '/menu/halibut.png',
    },
    {
      name: 'Wagyu Ribeye',
      description: 'Truffle jus, creamed spinach',
      price: '£42',
      image: '/menu/wagyu-ribeye.png',
    },
  ],
  desserts: [
    {
      name: 'Chocolate Soufflé',
      description: 'Warm center, vanilla bean ice cream',
      price: '£9',
      image: '/menu/chocolate-souffle.png',
    },
    {
      name: 'Lemon Tart',
      description: 'Meringue, seasonal berries',
      price: '£8',
      image: '/menu/lemon-tart.png',
    },
    {
      name: 'Cheese Selection',
      description: 'Artisanal cheeses with accompaniments',
      price: '£14',
      image: '/menu/cheese-selection.png',
    },
  ],
}

export function Menu() {
  const [activeTab, setActiveTab] = useState<'starters' | 'mains' | 'desserts'>('starters')

  return (
    <section className="py-20 md:py-32 px-4 md:px-8 bg-background">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Our Menu
          </h2>
          <p className="text-lg text-muted-foreground">
            Seasonal dishes crafted with the finest ingredients
          </p>
        </motion.div>

        {/* Tab Buttons */}
        <div className="flex justify-center gap-4 mb-12">
          {(['starters', 'mains', 'desserts'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 font-semibold rounded-lg transition-colors capitalize ${
                activeTab === tab
                  ? 'bg-primary text-white'
                  : 'bg-card text-foreground hover:bg-secondary hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {menuItems[activeTab].map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              {/* Image Container */}
              <div className="relative h-48 md:h-56 w-full overflow-hidden bg-muted">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover w-full h-full"
                  priority={index < 3}
                />
              </div>

              {/* Content Container */}
              <div className="p-5 md:p-6">
                <div className="flex justify-between items-start gap-3 mb-3">
                  <h3 className="text-lg md:text-xl font-serif font-bold text-foreground flex-1">
                    {item.name}
                  </h3>
                  <span className="text-lg md:text-xl font-bold text-primary flex-shrink-0">
                    {item.price}
                  </span>
                </div>
                <p className="text-sm md:text-base text-muted-foreground line-clamp-2">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
