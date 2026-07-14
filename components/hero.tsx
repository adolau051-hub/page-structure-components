'use client'

import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { HERO_VIDEO_URL, FALLBACK_VIDEO_URL } from '@/lib/hero-video'

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [src, setSrc] = useState(HERO_VIDEO_URL)

  function handleError() {
    if (src !== FALLBACK_VIDEO_URL) {
      setSrc(FALLBACK_VIDEO_URL)
    }
  }

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
        key={src}
        ref={videoRef}
        src={src}
        autoPlay
        muted
        playsInline
        poster="/hero.png"
        onEnded={handleEnded}
        onError={handleError}
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
          className="inline-block bg-accent hover:bg-primary text-white px-10 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105 hover:shadow-xl shadow-lg"
        >
          Book Your Table
        </motion.a>
      </div>
    </section>
  )
}
