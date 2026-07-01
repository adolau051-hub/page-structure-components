'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)

  function handleEnded() {
    const video = videoRef.current
    if (video) {
      video.currentTime = 0
      video.play()
    }
  }

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <video
        ref={videoRef}
        src="/restaurant_main.mp4"
        autoPlay
        muted
        playsInline
        poster="/hero.png"
        onEnded={handleEnded}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 text-center text-white px-4 md:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-serif font-bold mb-6 text-balance"
        >
          Riverstone Kitchen
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl mb-8 font-light text-balance"
        >
          Experience culinary excellence in an intimate setting
        </motion.p>

        <motion.a
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          href="#booking"
          className="inline-block bg-primary hover:bg-secondary text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          Book Your Table
        </motion.a>
      </div>
    </section>
  )
}
