import nodemailer from 'nodemailer';
import { ServiceType } from '@/components/contact/types';

// Configure email transporter
// For production, you would use actual SMTP credentials
const transporter = nodemailer.createTransport({
  host: 'smtp.example.com', // Replace with actual SMTP server
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'your-email@example.com', // Replace with actual email
    pass: 'your-password', // Replace with actual password
  },
  // For development/testing, uncomment this to prevent actual email sending
  tls: {
    rejectUnauthorized: false
  }
});

// Email templates
const getLeadConfirmationTemplate = (name: string, serviceType: ServiceType) => {
  const serviceNames = {
    apprenticeship: 'Apprenticeship Services',
    traineeship: 'Traineeship Services',
    recruitment: 'Recruitment Services',
    technology: 'Technology Services',
    compliance: 'Compliance Services',
    mentoring: 'Mentoring Services',
    future_services: 'Future Services'
  };

  const serviceName = serviceNames[serviceType] || 'Our Services';

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #c41230; padding: 20px; text-align: center;">
        <img src="https://www.braden.com.au/Gold+Logo+transparent-205w.png" alt="Braden Logo" style="max-width: 150px;">
      </div>
      <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
        <h2>Thank you for contacting Braden</h2>
        <p>Hello ${name},</p>
        <p>Thank you for your interest in ${serviceName} at Braden. We have received your inquiry and one of our specialists will be in touch with you shortly.</p>
        <p>At Braden, we pride ourselves on providing top-tier talent and solutions for businesses like yours.</p>
        <p>If you have any immediate questions, please don't hesitate to call us at (08) 1234 5678.</p>
        <p>Best regards,</p>
        <p>The Braden Team</p>
      </div>
      <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px;">
        <p>5/339 Cambridge Street, WEMBLEY, WA 6014</p>
        <p>© ${new Date().getFullYear()} Braden Group. All rights reserved.</p>
      </div>
    </div>
  `;
};

const getStaffNotificationTemplate = (leadData: any) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #c41230; padding: 20px; text-align: center; color: white;">
        <h2>New Lead Notification</h2>
      </div>
      <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
        <h3>A new lead has been submitted through the website:</h3>
        <ul style="list-style-type: none; padding: 0;">
          <li><strong>Name:</strong> ${leadData.name}</li>
          <li><strong>Email:</strong> ${leadData.email}</li>
          <li><strong>Phone:</strong> ${leadData.phone}</li>
          <li><strong>Company:</strong> ${leadData.company}</li>
          <li><strong>Service Interest:</strong> ${leadData.serviceType}</li>
          <li><strong>Message:</strong> ${leadData.message}</li>
          <li><strong>Submission Date:</strong> ${new Date().toLocaleString()}</li>
        </ul>
        <p>Please follow up with this lead within 24 hours.</p>
      </div>
    </div>
  `;
};

// Send confirmation email to lead
export const sendLeadConfirmationEmail = async (to: string, name: string, serviceType: ServiceType) => {
  const mailOptions = {
    from: '"Braden Group" <no-reply@braden.com.au>',
    to,
    subject: 'Thank You for Contacting Braden',
    html: getLeadConfirmationTemplate(name, serviceType),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return { success: false, error };
  }
};

// Send notification email to staff
export const sendStaffNotificationEmail = async (staffEmail: string, leadData: any) => {
  const mailOptions = {
    from: '"Braden Website" <no-reply@braden.com.au>',
    to: staffEmail,
    subject: `New Lead: ${leadData.name} from ${leadData.company}`,
    html: getStaffNotificationTemplate(leadData),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Staff notification email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending staff notification email:', error);
    return { success: false, error };
  }
};
