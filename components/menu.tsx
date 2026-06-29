'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const menuItems = {
  starters: [
    {
      name: 'Amuse Bouche',
      description: 'Chef&apos;s seasonal selection',
    },
    {
      name: 'Foie Gras Terrine',
      description: 'With brioche and fig compote',
    },
    {
      name: 'Burrata & Heirloom Tomatoes',
      description: 'Fresh buffalo mozzarella, aged balsamic',
    },
  ],
  mains: [
    {
      name: 'Herb-Roasted Duck Breast',
      description: 'Cherry gastrique, seasonal vegetables',
    },
    {
      name: 'Pan-Seared Halibut',
      description: 'Beurre blanc, asparagus, new potatoes',
    },
    {
      name: 'Wagyu Ribeye',
      description: 'Truffle jus, creamed spinach',
    },
  ],
  desserts: [
    {
      name: 'Chocolate Soufflé',
      description: 'Warm center, vanilla bean ice cream',
    },
    {
      name: 'Lemon Tart',
      description: 'Meringue, seasonal berries',
    },
    {
      name: 'Cheese Selection',
      description: 'Artisanal cheeses with accompaniments',
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
          className="space-y-8"
        >
          {menuItems[activeTab].map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border-b border-border pb-6 last:border-b-0"
            >
              <h3 className="text-xl font-serif font-bold text-foreground mb-2">
                {item.name}
              </h3>
              <p className="text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
