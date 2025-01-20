import dotenv from 'dotenv';
import nodemailer, { SentMessageInfo } from 'nodemailer';
import crypto from 'crypto';

dotenv.config(); // Loads environment variables from .env file

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.senderEmail,
    pass: process.env.emailPass,
  },
});

// Generate OTP function
function generateOTP(length: number = 6): string {
  return crypto.randomInt(0, Math.pow(10, length)).toString().padStart(length, '0');
}

// Send OTP for general purposes
async function sendOTP(email: string, otp: string): Promise<void> {
  const mailOptions = {
    from: process.env.email,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}. It is valid for the next 10 minutes.`,
  };

  try {
    const info: SentMessageInfo = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending OTP email:', error);
  }
}

// Send OTP for forgot password scenario
async function sendOTPForgot(email: string, otp: string): Promise<void> {
  const mailOptions = {
    from: process.env.email,
    to: email,
    subject: 'Your Password Reset OTP',
    text: `Your OTP code is ${otp} for changing your password. It is valid for the next 10 minutes. Verify it to change your password.`,
  };

  try {
    const info: SentMessageInfo = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending OTP email for password reset:', error);
  }
}

// Export functions
export {
  generateOTP,
  sendOTP,
  sendOTPForgot,
};
