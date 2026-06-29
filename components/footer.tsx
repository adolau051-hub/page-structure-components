'use client'

export function Footer() {
  return (
    <footer className="bg-border text-foreground py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-serif font-bold mb-4 text-foreground">Lumière Bistro</h3>
            <p className="text-muted-foreground">
              Experience fine dining in an intimate, welcoming atmosphere.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Hours</h4>
            <p className="text-muted-foreground">
              Tuesday – Thursday: 5:00 PM – 11:00 PM
              <br />
              Friday – Saturday: 5:00 PM – 11:30 PM
              <br />
              Sunday – Monday: Closed
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Contact</h4>
            <p className="text-muted-foreground">
              Phone: +44 (0)20 1234 5678
              <br />
              Email: hello@lumiere-bistro.co.uk
              <br />
              123 Marylebone Lane, London W1U 2QF
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Instagram
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Twitter (X)
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Facebook
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                TikTok
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-input pt-8 text-center text-muted-foreground">
          <p>&copy; 2026 Lumière Bistro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
