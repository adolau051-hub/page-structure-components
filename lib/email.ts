import nodemailer, { type Transporter } from 'nodemailer'

let transporter: Transporter | null = null

function getTransporter(): Transporter | null {
  if (transporter) return transporter

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return null
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT),
    secure: parseInt(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })

  return transporter
}

function formatDate(date: string): string {
  try {
    return new Date(date).toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return date
  }
}

function formatPrice(price: number): string {
  return price === 0 ? 'Free' : `£${price}`
}

function getExperienceLabel(experience: string): string {
  switch (experience) {
    case 'chefs-table':
      return "Chef's Table"
    case 'hearth-table':
      return 'The Hearth Table'
    case 'seasonal-tasting':
      return 'Seasonal Tasting'
    case 'walk-in':
      return 'Walk-In Dining'
    default:
      return experience
  }
}

export interface BookingEmailData {
  name: string
  date: string
  time: string
  partySize: number
  experience: string
}

export async function sendBookingConfirmation(
  to: string,
  data: BookingEmailData
): Promise<void> {
  const transport = getTransporter()
  if (!transport) {
    console.warn('[email] SMTP not configured — skipping booking confirmation')
    return
  }

  const experienceLabel = getExperienceLabel(data.experience)
  const formattedDate = formatDate(data.date)

  const html = `
    <div style="font-family: Georgia, 'Times New Roman', serif; max-width: 600px; margin: 0 auto; background: #faf6f1; padding: 40px 30px; color: #2d2416;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 28px; color: #8b6f47; margin: 0;">Riverstone Kitchen</h1>
        <p style="color: #6b5d52; margin: 5px 0 0;">Experiences &amp; Dining</p>
      </div>
      <div style="background: #fff9f5; border: 1px solid #e8dfd4; border-radius: 8px; padding: 30px;">
        <h2 style="color: #2d2416; margin-top: 0;">Reservation Confirmed</h2>
        <p style="color: #6b5d52;">Dear ${data.name},</p>
        <p style="color: #6b5d52;">We are delighted to confirm your reservation at Riverstone Kitchen. We look forward to welcoming you.</p>
        <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #6b5d52;">Experience</td><td style="padding: 8px 0; color: #2d2416; font-weight: bold; text-align: right;">${experienceLabel}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b5d52;">Date</td><td style="padding: 8px 0; color: #2d2416; font-weight: bold; text-align: right;">${formattedDate}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b5d52;">Time</td><td style="padding: 8px 0; color: #2d2416; font-weight: bold; text-align: right;">${data.time}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b5d52;">Party Size</td><td style="padding: 8px 0; color: #2d2416; font-weight: bold; text-align: right;">${data.partySize} ${data.partySize === 1 ? 'guest' : 'guests'}</td></tr>
        </table>
        <p style="color: #6b5d52; font-size: 14px; margin-top: 20px;">123 Marylebone Lane, London W1U 2QF<br/>+44 (0)20 1234 5678</p>
      </div>
      <p style="text-align: center; color: #6b5d52; font-size: 12px; margin-top: 30px;">&copy; 2026 Riverstone Kitchen. All rights reserved.</p>
    </div>
  `

  await transport.sendMail({
    from: `"Riverstone Kitchen" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Reservation Confirmed — Riverstone Kitchen',
    html,
  })
}

export interface StaffNotificationData {
  customerName: string
  customerEmail: string
  customerPhone: string
  date: string
  time: string
  partySize: number
  experience: string
  dietaryRestrictions?: string | null
  specialNotes?: string | null
}

export async function sendStaffNotification(
  to: string,
  data: StaffNotificationData
): Promise<void> {
  const transport = getTransporter()
  if (!transport) {
    console.warn('[email] SMTP not configured — skipping staff notification')
    return
  }

  const experienceLabel = getExperienceLabel(data.experience)
  const formattedDate = formatDate(data.date)

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #faf6f1; padding: 40px 30px; color: #2d2416;">
      <div style="background: #fff9f5; border: 1px solid #e8dfd4; border-radius: 8px; padding: 30px;">
        <h2 style="color: #8b6f47; margin-top: 0;">New Reservation</h2>
        <p>A new booking has been made at Riverstone Kitchen.</p>
        <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; color: #6b5d52;">Customer</td><td style="padding: 6px 0; font-weight: bold; text-align: right;">${data.customerName}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b5d52;">Email</td><td style="padding: 6px 0; text-align: right;">${data.customerEmail}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b5d52;">Phone</td><td style="padding: 6px 0; text-align: right;">${data.customerPhone}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b5d52;">Experience</td><td style="padding: 6px 0; font-weight: bold; text-align: right;">${experienceLabel}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b5d52;">Date</td><td style="padding: 6px 0; font-weight: bold; text-align: right;">${formattedDate}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b5d52;">Time</td><td style="padding: 6px 0; font-weight: bold; text-align: right;">${data.time}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b5d52;">Party Size</td><td style="padding: 6px 0; font-weight: bold; text-align: right;">${data.partySize}</td></tr>
          ${data.dietaryRestrictions ? `<tr><td style="padding: 6px 0; color: #6b5d52;">Dietary</td><td style="padding: 6px 0; text-align: right;">${data.dietaryRestrictions}</td></tr>` : ''}
          ${data.specialNotes ? `<tr><td style="padding: 6px 0; color: #6b5d52;">Notes</td><td style="padding: 6px 0; text-align: right;">${data.specialNotes}</td></tr>` : ''}
        </table>
      </div>
    </div>
  `

  await transport.sendMail({
    from: `"Riverstone Kitchen Bookings" <${process.env.SMTP_USER}>`,
    to,
    subject: `New Reservation — ${data.customerName} (${formattedDate} at ${data.time})`,
    html,
  })
}

export interface ReminderEmailData {
  name: string
  date: string
  time: string
  partySize: number
  experience: string
}

export async function sendReminderEmail(
  to: string,
  data: ReminderEmailData
): Promise<void> {
  const transport = getTransporter()
  if (!transport) {
    console.warn('[email] SMTP not configured — skipping reminder')
    return
  }

  const experienceLabel = getExperienceLabel(data.experience)
  const formattedDate = formatDate(data.date)

  const html = `
    <div style="font-family: Georgia, 'Times New Roman', serif; max-width: 600px; margin: 0 auto; background: #faf6f1; padding: 40px 30px; color: #2d2416;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 28px; color: #8b6f47; margin: 0;">Riverstone Kitchen</h1>
      </div>
      <div style="background: #fff9f5; border: 1px solid #e8dfd4; border-radius: 8px; padding: 30px;">
        <h2 style="color: #2d2416; margin-top: 0;">Reservation Reminder</h2>
        <p style="color: #6b5d52;">Dear ${data.name},</p>
        <p style="color: #6b5d52;">This is a friendly reminder of your reservation at Riverstone Kitchen tomorrow.</p>
        <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #6b5d52;">Experience</td><td style="padding: 8px 0; color: #2d2416; font-weight: bold; text-align: right;">${experienceLabel}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b5d52;">Date</td><td style="padding: 8px 0; color: #2d2416; font-weight: bold; text-align: right;">${formattedDate}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b5d52;">Time</td><td style="padding: 8px 0; color: #2d2416; font-weight: bold; text-align: right;">${data.time}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b5d52;">Party Size</td><td style="padding: 8px 0; color: #2d2416; font-weight: bold; text-align: right;">${data.partySize}</td></tr>
        </table>
        <p style="color: #6b5d52; font-size: 14px; margin-top: 20px;">123 Marylebone Lane, London W1U 2QF<br/>+44 (0)20 1234 5678</p>
      </div>
      <p style="text-align: center; color: #6b5d52; font-size: 12px; margin-top: 30px;">&copy; 2026 Riverstone Kitchen. All rights reserved.</p>
    </div>
  `

  await transport.sendMail({
    from: `"Riverstone Kitchen" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Reservation Reminder — Riverstone Kitchen',
    html,
  })
}

export { formatPrice as formatGbp }
