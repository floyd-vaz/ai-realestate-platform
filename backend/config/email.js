const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEnquiryEmail = async (enquiryData) => {
  const { buyerName, buyerEmail, buyerPhone, message, propertyTitle, propertyId } = enquiryData;

  // Email to Admin
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: `New Enquiry for: ${propertyTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Property Enquiry</h2>
        <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h3 style="margin: 0 0 15px;">Property: ${propertyTitle}</h3>
          <p><strong>Buyer Name:</strong> ${buyerName}</p>
          <p><strong>Buyer Email:</strong> ${buyerEmail}</p>
          <p><strong>Buyer Phone:</strong> ${buyerPhone || 'Not provided'}</p>
          <p><strong>Message:</strong> ${message}</p>
        </div>
        <a href="${process.env.FRONTEND_URL}/properties/${propertyId}" 
           style="background: #2563eb; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">
          View Property
        </a>
      </div>
    `
  });

  // Confirmation email to Buyer
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: buyerEmail,
    subject: `Enquiry Received — ${propertyTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Thanks for your Enquiry!</h2>
        <p>Hi ${buyerName},</p>
        <p>We've received your enquiry for <strong>${propertyTitle}</strong>.</p>
        <p>Our agent will contact you within 24 hours.</p>
        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Your Message:</strong> ${message}</p>
        </div>
        <p style="color: #64748b; font-size: 14px;">— EstateAI Team</p>
      </div>
    `
  });
};

module.exports = { sendEnquiryEmail };