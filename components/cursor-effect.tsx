'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

interface Ripple {
  id: number
  x: number
  y: number
}

export function CursorEffect() {
  const [isVisible, setIsVisible] = useState(false)
  const [ripples, setRipples] = useState<Ripple[]>([])
  const rippleId = useRef(0)

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  const dotX = useSpring(mouseX, { stiffness: 800, damping: 35, mass: 0.3 })
  const dotY = useSpring(mouseY, { stiffness: 800, damping: 35, mass: 0.3 })

  const ringX = useSpring(mouseX, { stiffness: 200, damping: 25, mass: 0.5 })
  const ringY = useSpring(mouseY, { stiffness: 200, damping: 25, mass: 0.5 })

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(pointer: coarse)').matches) return

    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      if (!isVisible) setIsVisible(true)
    }

    const handleDown = (e: MouseEvent) => {
      const id = rippleId.current++
      setRipples((prev) => [...prev, { id, x: e.clientX, y: e.clientY }])
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id))
      }, 800)
    }

    const handleLeave = () => setIsVisible(false)

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mousedown', handleDown)
    document.addEventListener('mouseleave', handleLeave)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mousedown', handleDown)
      document.removeEventListener('mouseleave', handleLeave)
    }
  }, [mouseX, mouseY, isVisible])

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden>
      <motion.div
        style={{ x: dotX, y: dotY }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-accent"
      />
      <motion.div
        style={{ x: ringX, y: ringY }}
        animate={{ opacity: isVisible ? 0.5 : 0 }}
        className="absolute -top-5 -left-5 w-10 h-10 rounded-full border border-accent/60"
        transition={{ duration: 0.3 }}
      />

      {ripples.map((ripple) => (
        <motion.div
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 8, opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ left: ripple.x, top: ripple.y }}
          className="absolute w-8 h-8 -ml-4 -mt-4 rounded-full border-2 border-accent"
        />
      ))}
    </div>
  )
}
