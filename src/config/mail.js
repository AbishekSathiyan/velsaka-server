// backend/config/email.js
import nodemailer from 'nodemailer';
import dns from 'dns';

// Force IPv4
dns.setDefaultResultOrder('ipv4first');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
  // Force IPv4 by specifying family
  family: 4,
  tls: {
    rejectUnauthorized: false,
    ciphers: 'SSLv3',
  },
});