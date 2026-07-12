'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'

const menuItems = {
  starters: [
    {
      name: 'Amuse Bouche',
      price: 10,
      description: "Chef's seasonal selection of delicate, bite-sized appetizers.",
      image: '/images/menu/amuse-bouche.png',
    },
    {
      name: 'Foie Gras Terrine',
      price: 18,
      description: 'Silky foie gras terrine served with toasted brioche and sweet fig compote.',
      image: '/images/menu/foie-gras.png',
    },
    {
      name: 'Burrata & Heirloom Tomatoes',
      price: 14,
      description: 'Creamy buffalo burrata, heirloom cherry tomatoes, aged balsamic, and fragrant basil oil.',
      image: '/images/menu/burrata.png',
    },
  ],
  mains: [
    {
      name: 'Pan-Seared Halibut',
      price: 30,
      description: 'Perfectly pan-seared halibut with rich beurre blanc, tender asparagus, and new potatoes.',
      image: '/images/menu/pan-seared-halibut.png',
    },
    {
      name: 'Wagyu Ribeye',
      price: 65,
      description: 'Exquisite Wagyu ribeye steak paired with a rich truffle jus and creamy spinach.',
      image: '/images/menu/wagyu-ribeye.png',
    },
    {
      name: 'Roasted Rack of Lamb',
      price: 38,
      description: 'Herb-crusted rack of lamb served with roasted root vegetables and red wine reduction.',
      image: '/images/menu/rack-of-lamb.png',
    },
  ],
  desserts: [
    {
      name: 'Chocolate Soufflé',
      price: 12,
      description: 'Warm chocolate soufflé with a molten center, served with vanilla bean ice cream.',
      image: '/images/menu/chocolate-souffle.png',
    },
    {
      name: 'Lemon Tart',
      price: 10,
      description: 'Crisp pastry shell filled with tangy lemon curd, topped with toasted meringue and fresh berries.',
      image: '/images/menu/lemon-tart.png',
    },
    {
      name: 'Cheese Selection',
      price: 14,
      description: 'A curated selection of artisanal cheeses served with honey, grapes, and crackers.',
      image: '/images/menu/cheese-selection.png',
    },
  ],
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 16,
    },
  },
}

export function Menu() {
  const [activeTab, setActiveTab] = useState<'starters' | 'mains' | 'desserts'>('starters')

  return (
    <section className="py-20 md:py-32 px-4 md:px-8 bg-background border-t border-border/20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold tracking-widest text-xs uppercase mb-3 block">
            Gastronomy
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Our Menu
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our carefully curated dishes, crafted using only the finest seasonal ingredients.
          </p>
        </motion.div>

        {/* Tab Buttons */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex bg-muted/60 p-1 rounded-full border border-border/30 backdrop-blur-md">
            {(['starters', 'mains', 'desserts'] as const).map((tab) => {
              const isActive = activeTab === tab
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-8 py-3 rounded-full text-sm font-semibold transition-colors duration-300 capitalize z-10 ${
                    isActive ? 'text-white' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="active-menu-tab"
                      className="absolute inset-0 bg-primary rounded-full -z-10"
                      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                    />
                  )}
                  {tab}
                </button>
              )
            })}
          </div>
        </div>

        {/* Menu Items Grid */}
        <motion.div
          key={activeTab}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center"
        >
          {menuItems[activeTab].map((item) => (
            <motion.div
              key={item.name}
              variants={cardVariants}
              className="group flex flex-col bg-card rounded-2xl overflow-hidden border border-border/40 hover:border-primary/30 shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden bg-muted">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>

              {/* Card Details */}
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <h3 className="text-xl font-serif font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      {item.name}
                    </h3>
                    <span className="text-xl font-semibold text-primary shrink-0">
                      £{item.price}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
