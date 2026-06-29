import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export async function sendBookingConfirmation(
  to: string,
  bookingDetails: {
    name: string
    date: string
    time: string
    partySize: number
    experience: string
  }
) {
  const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/bookings/cancel?email=${encodeURIComponent(to)}`

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #8b6f47;">Your Reservation at Lumière Bistro</h2>
      <p>Dear ${bookingDetails.name},</p>
      <p>Thank you for booking with us. Your reservation details are below:</p>
      
      <div style="background: #f3ede5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Experience:</strong> ${bookingDetails.experience}</p>
        <p><strong>Date:</strong> ${new Date(bookingDetails.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${bookingDetails.time}</p>
        <p><strong>Party Size:</strong> ${bookingDetails.partySize} people</p>
      </div>

      <p>If you need to cancel or modify your reservation, please <a href="${cancelUrl}" style="color: #8b6f47;">click here</a>.</p>
      
      <p>We look forward to welcoming you!</p>
      <p>Warm regards,<br/>The Lumière Bistro Team</p>
    </div>
  `

  return transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: 'Your Lumière Bistro Reservation Confirmed',
    html,
  })
}

export async function sendReminderEmail(
  to: string,
  bookingDetails: {
    name: string
    date: string
    time: string
    partySize: number
    experience: string
  }
) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #8b6f47;">Reminder: Your Lumière Bistro Reservation Tomorrow</h2>
      <p>Dear ${bookingDetails.name},</p>
      <p>This is a friendly reminder about your upcoming reservation:</p>
      
      <div style="background: #f3ede5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Date:</strong> ${new Date(bookingDetails.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${bookingDetails.time}</p>
        <p><strong>Party Size:</strong> ${bookingDetails.partySize} people</p>
      </div>

      <p>We look forward to seeing you!</p>
      <p>Warm regards,<br/>The Lumière Bistro Team</p>
    </div>
  `

  return transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: 'Reminder: Your Lumière Bistro Reservation',
    html,
  })
}

export async function sendStaffNotification(
  to: string,
  bookingDetails: {
    customerName: string
    customerEmail: string
    customerPhone: string
    date: string
    time: string
    partySize: number
    experience: string
    dietaryRestrictions?: string
    specialNotes?: string
  }
) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #8b6f47;">New Booking - Lumière Bistro</h2>
      
      <div style="background: #f3ede5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Customer:</strong> ${bookingDetails.customerName}</p>
        <p><strong>Email:</strong> ${bookingDetails.customerEmail}</p>
        <p><strong>Phone:</strong> ${bookingDetails.customerPhone}</p>
        <p><strong>Experience:</strong> ${bookingDetails.experience}</p>
        <p><strong>Date:</strong> ${new Date(bookingDetails.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${bookingDetails.time}</p>
        <p><strong>Party Size:</strong> ${bookingDetails.partySize} people</p>
        ${bookingDetails.dietaryRestrictions ? `<p><strong>Dietary Restrictions:</strong> ${bookingDetails.dietaryRestrictions}</p>` : ''}
        ${bookingDetails.specialNotes ? `<p><strong>Special Notes:</strong> ${bookingDetails.specialNotes}</p>` : ''}
      </div>
    </div>
  `

  return transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: `New Booking - ${new Date(bookingDetails.date).toLocaleDateString()} at ${bookingDetails.time}`,
    html,
  })
}
