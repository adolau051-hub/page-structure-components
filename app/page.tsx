import { Hero } from '@/components/hero'
import { Experiences } from '@/components/experiences'
import { Menu } from '@/components/menu'
import { BookingForm } from '@/components/booking-form'
import { Footer } from '@/components/footer'
import { Navigation } from '@/components/navigation'
import { AdminPortal } from '@/components/admin-portal'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div id="home" className="pt-20">
        <Hero />
      </div>
      <div id="experiences">
        <Experiences />
      </div>
      <div id="menu">
        <Menu />
      </div>
      <div id="booking">
        <BookingForm />
      </div>
      <Footer />
      <AdminPortal />
    </main>
  )
}
