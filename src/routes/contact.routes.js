import express from "express";
import Contact from "../models/contact.model.js";
import nodemailer from "nodemailer";
import { ENV } from "../config/env.js";

const router = express.Router();

// FIXED: Proper Gmail SMTP configuration (production safe)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // MUST be Gmail App Password
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 10000, // FIX: avoid Render timeout crash
});

// Verify email configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email configuration error:", error);
  } else {
    console.log("✅ Email server is ready to send messages");
  }
});

// Professional email template for admin notification
const sendAdminEmailNotification = async (contactData) => {
  const { fullName, email, phone, service, message } = contactData;
  const createdAt = contactData.createdAt || new Date();

  const emailTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Lead - VELSAKA TECH</title>
  <style>
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; margin: 20px auto !important; }
      .content { padding: 20px !important; }
      .header { padding: 20px !important; }
    }
  </style>
</head>

<body style="margin:0; padding:0; background:#f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">

  <div class="container" style="max-width:640px; margin:40px auto; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.08);">

    <!-- HEADER -->
    <div class="header" style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); padding:32px 28px; text-align:center;">
      <div style="font-size:24px; font-weight:800; color:#ffffff; letter-spacing:1.5px;">
        VELSAKA TECH
      </div>
      <div style="font-size:12px; color:rgba(255,255,255,0.85); margin-top:8px; letter-spacing:1px;">
        INNOVATION BEYOND BORDERS
      </div>
      <div style="display:inline-block; background:rgba(255,255,255,0.2); backdrop-filter:blur(10px); color:white; padding:5px 16px; border-radius:20px; font-size:11px; font-weight:600; margin-top:15px;">
        NEW LEAD - ACTION REQUIRED
      </div>
    </div>

    <!-- BODY -->
    <div class="content" style="padding:32px 28px;">

      <div style="font-size:22px; font-weight:700; color:#1a1a2e; margin-bottom:6px;">
        New Contact Request
      </div>

      <div style="font-size:14px; color:#6b7280; margin-bottom:24px; border-left:3px solid #667eea; padding-left:14px;">
        A potential client has reached out through your website
      </div>

      <!-- INFO GRID -->
      <div style="background:#f9fafb; border:1px solid #e5e7eb; border-radius:12px; padding:20px; margin-bottom:20px;">
        <div style="font-size:12px; font-weight:700; color:#667eea; text-transform:uppercase; letter-spacing:1px; margin-bottom:16px;">
          SUBMISSION DETAILS
        </div>
        
        <div style="display:flex; padding:8px 0; border-bottom:1px solid #e5e7eb;">
          <div style="font-weight:600; color:#374151; width:110px; font-size:14px;">Date & Time:</div>
          <div style="color:#6b7280; flex:1; font-size:14px;">${new Date(
            createdAt,
          ).toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}</div>
        </div>
      </div>

      <div style="background:#f9fafb; border:1px solid #e5e7eb; border-radius:12px; padding:20px; margin-bottom:20px;">
        <div style="font-size:12px; font-weight:700; color:#667eea; text-transform:uppercase; letter-spacing:1px; margin-bottom:16px;">
          CONTACT INFORMATION
        </div>
        
        <div style="display:flex; padding:8px 0; border-bottom:1px solid #e5e7eb;">
          <div style="font-weight:600; color:#374151; width:110px; font-size:14px;">Full Name:</div>
          <div style="color:#1a1a2e; flex:1; font-size:14px; font-weight:600;">${fullName}</div>
        </div>
        
        <div style="display:flex; padding:8px 0; border-bottom:1px solid #e5e7eb;">
          <div style="font-weight:600; color:#374151; width:110px; font-size:14px;">Email:</div>
          <div style="color:#6b7280; flex:1; font-size:14px;"><a href="mailto:${email}" style="color:#667eea; text-decoration:none;">${email}</a></div>
        </div>
        
        <div style="display:flex; padding:8px 0; border-bottom:1px solid #e5e7eb;">
          <div style="font-weight:600; color:#374151; width:110px; font-size:14px;">Phone:</div>
          <div style="color:#6b7280; flex:1; font-size:14px;">${phone || '<span style="color:#adb5bd;">Not provided</span>'}</div>
        </div>
        
        <div style="display:flex; padding:8px 0;">
          <div style="font-weight:600; color:#374151; width:110px; font-size:14px;">Service:</div>
          <div style="flex:1;"><span style="display:inline-block; background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); color:white; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:600;">${service}</span></div>
        </div>
      </div>

      <!-- MESSAGE -->
      <div style="margin-bottom:24px;">
        <div style="font-size:12px; font-weight:700; color:#667eea; text-transform:uppercase; letter-spacing:1px; margin-bottom:12px;">
          PROJECT DETAILS
        </div>

        <div style="background:#ffffff; border:1px solid #e5e7eb; padding:16px; border-radius:10px; font-size:14px; color:#374151; line-height:1.7;">
          ${message.replace(/\n/g, "<br>")}
        </div>
      </div>

      <!-- STATS -->
      <div style="display:flex; gap:15px; margin:24px 0;">
        <div style="flex:1; background:linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); border:1px solid #e5e7eb; border-radius:10px; padding:15px; text-align:center;">
          <div style="font-size:24px; font-weight:800; background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">24 HOURS</div>
          <div style="font-size:11px; color:#6b7280; margin-top:5px;">TARGET RESPONSE</div>
        </div>
        <div style="flex:1; background:linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); border:1px solid #e5e7eb; border-radius:10px; padding:15px; text-align:center;">
          <div style="font-size:24px; font-weight:800; background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">100%</div>
          <div style="font-size:11px; color:#6b7280; margin-top:5px;">SATISFACTION RATE</div>
        </div>
      </div>

      <!-- CTA -->
      <div style="text-align:center;">
        <a href="${process.env.ADMIN_PANEL_URL || "http://localhost:5173/admin/contacts"}"
           style="display:inline-block; background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); color:#ffffff; padding:12px 28px; border-radius:25px; text-decoration:none; font-weight:700; font-size:14px; box-shadow:0 4px 12px rgba(102,126,234,0.3); transition:transform 0.2s;">
          VIEW FULL DETAILS →
        </a>
      </div>

    </div>

    <!-- FOOTER -->
    <div style="background:#f8f9fa; text-align:center; padding:20px; border-top:1px solid #e5e7eb;">
      <div style="margin:12px 0;">
        <a href="https://github.com/AbishekSathiyan" style="color:#667eea; text-decoration:none; margin:0 12px; font-size:12px;">GITHUB</a> •
        <a href="https://www.linkedin.com/in/abishek04/" style="color:#667eea; text-decoration:none; margin:0 12px; font-size:12px;">LINKEDIN</a> •
        <a href="${ENV.CLIENT_URL || "http://localhost:5173"}" style="color:#667eea; text-decoration:none; margin:0 12px; font-size:12px;">VELSAKA TECH</a> •
        <a href="https://wa.me/917092085864" style="color:#667eea; text-decoration:none; margin:0 12px; font-size:12px;">WHATSAPP</a>
      </div>
      <div style="font-size:11px; color:#9ca3af;">
        © ${new Date().getFullYear()} VELSAKA TECH. All rights reserved.<br>
        Methalodai, Ramanathapuram, Tamil Nadu, India - 623532
      </div>
    </div>

  </div>

</body>
</html>
  `;

  try {
    const result = await transporter.sendMail({
      from: `"VELSAKA TECH" <${process.env.EMAIL_USER}>`,
      to: "abishek.sathiyan.2002@gmail.com",
      subject: `New Lead: ${service} inquiry from ${fullName}`,
      html: emailTemplate,
      text: `
        NEW CONTACT FORM SUBMISSION
        
        Name: ${fullName}
        Email: ${email}
        Phone: ${phone || "Not provided"}
        Service: ${service}
        Message: ${message}
        
        Submitted: ${new Date(createdAt).toLocaleString()}
        
        View in Admin Panel: ${process.env.ADMIN_PANEL_URL || "http://localhost:5173/admin/contacts"}
      `,
    });
    console.log("✅ Admin email sent:", result.response);
    return result;
  } catch (error) {
    console.error("❌ Failed to send admin email:", error.message);
    return null; // FIX: prevent crash, return null instead of throwing
  }
};

// Professional auto-reply email template for customer
const sendAutoReplyEmail = async (contactData) => {
  const { fullName, email, service, message } = contactData;
  const _id = contactData._id || contactData.id;

  const autoReplyTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Thank You - VELSAKA TECH</title>
  <style>
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; margin: 20px auto !important; }
      .content { padding: 20px !important; }
      .header { padding: 20px !important; }
      .contact-buttons a { display: block !important; margin: 8px 0 !important; }
    }
  </style>
</head>

<body style="margin:0; padding:0; background:#f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">

  <div class="container" style="max-width:600px; margin:40px auto; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.08);">

    <!-- HEADER -->
    <div class="header" style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); padding:32px 28px; text-align:center;">
      <div style="font-size:24px; font-weight:800; color:#ffffff; letter-spacing:1.5px;">
        VELSAKA TECH
      </div>
      <div style="font-size:12px; color:rgba(255,255,255,0.85); margin-top:8px; letter-spacing:1px;">
        INNOVATION BEYOND BORDERS
      </div>
      <div style="display:inline-block; background:rgba(255,255,255,0.2); backdrop-filter:blur(10px); color:white; padding:5px 16px; border-radius:20px; font-size:11px; font-weight:600; margin-top:15px;">
        WE'VE RECEIVED YOUR INQUIRY
      </div>
    </div>

    <!-- BODY -->
    <div class="content" style="padding:32px 28px;">

      <div style="font-size:24px; font-weight:700; color:#1a1a2e; margin-bottom:8px;">
        Hi ${fullName}!
      </div>

      <div style="font-size:15px; color:#6b7280; line-height:1.6; margin-bottom:24px;">
        Thank you for choosing VELSAKA TECH for your technology needs. Our team has received your request for <strong>${service}</strong> services.
      </div>

      <!-- SERVICE HIGHLIGHT -->
      <div style="background:linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); border-left:4px solid #667eea; padding:16px 20px; margin-bottom:24px; border-radius:8px;">
        <div style="font-size:12px; font-weight:700; color:#667eea; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px;">
          SERVICE REQUESTED
        </div>
        <div style="font-size:16px; font-weight:600; color:#1a1a2e;">${service}</div>
      </div>

      <!-- NEXT STEPS -->
      <div style="background:#f9fafb; border-radius:12px; padding:20px; margin-bottom:24px; border:1px solid #e5e7eb;">
        <div style="font-size:16px; font-weight:700; color:#1a1a2e; margin-bottom:16px; text-align:center;">
          WHAT HAPPENS NEXT?
        </div>
        
        <div style="display:flex; align-items:flex-start; margin-bottom:18px;">
          <div style="width:32px; height:32px; background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-weight:700; font-size:14px; margin-right:14px; flex-shrink:0;">1</div>
          <div>
            <div style="font-weight:700; color:#1a1a2e; margin-bottom:4px; font-size:14px;">CONFIRMATION</div>
            <div style="color:#6b7280; font-size:13px;">You'll receive a confirmation call or email within 24 hours</div>
          </div>
        </div>
        
        <div style="display:flex; align-items:flex-start; margin-bottom:18px;">
          <div style="width:32px; height:32px; background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-weight:700; font-size:14px; margin-right:14px; flex-shrink:0;">2</div>
          <div>
            <div style="font-weight:700; color:#1a1a2e; margin-bottom:4px; font-size:14px;">CONSULTATION</div>
            <div style="color:#6b7280; font-size:13px;">We'll schedule a detailed discussion about your requirements</div>
          </div>
        </div>
        
        <div style="display:flex; align-items:flex-start; margin-bottom:18px;">
          <div style="width:32px; height:32px; background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-weight:700; font-size:14px; margin-right:14px; flex-shrink:0;">3</div>
          <div>
            <div style="font-weight:700; color:#1a1a2e; margin-bottom:4px; font-size:14px;">PROPOSAL</div>
            <div style="color:#6b7280; font-size:13px;">You'll receive a tailored solution proposal within 3-5 days</div>
          </div>
        </div>
        
        <div style="display:flex; align-items:flex-start;">
          <div style="width:32px; height:32px; background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-weight:700; font-size:14px; margin-right:14px; flex-shrink:0;">4</div>
          <div>
            <div style="font-weight:700; color:#1a1a2e; margin-bottom:4px; font-size:14px;">PROJECT KICKOFF</div>
            <div style="color:#6b7280; font-size:13px;">Once approved, we'll start bringing your vision to life</div>
          </div>
        </div>
      </div>

      <!-- FOUNDER SECTION -->
      <div style="background:linear-gradient(135deg, #667eea10 0%, #764ba210 100%); border-radius:12px; padding:20px; margin-bottom:24px; border:1px solid #667eea20; text-align:center;">
        <div style="font-size:12px; font-weight:700; color:#667eea; text-transform:uppercase; letter-spacing:1px; margin-bottom:12px;">
          MEET THE FOUNDER
        </div>
        <div style="font-size:14px; color:#1a1a2e; margin-bottom:8px;">
          <strong>Abishek Sathiyan</strong> - Founder & Chief Architect
        </div>
        <div style="font-size:13px; color:#6b7280; margin-bottom:12px;">
          Building innovative tech solutions with passion and precision
        </div>
        <a href="https://abisheksathiyan-portfolio-front-end.vercel.app/" 
           style="display:inline-block; background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); color:#ffffff; padding:8px 20px; border-radius:20px; text-decoration:none; font-weight:600; font-size:12px; transition:transform 0.2s;">
          VIEW FOUNDER'S PORTFOLIO →
        </a>
      </div>

      <!-- MESSAGE SUMMARY -->
      <div style="background:#ffffff; border:1px solid #e5e7eb; border-radius:10px; padding:16px; margin-bottom:24px;">
        <div style="font-size:11px; font-weight:700; color:#667eea; text-transform:uppercase; letter-spacing:1px; margin-bottom:8px;">
          YOUR MESSAGE SUMMARY
        </div>
        <div style="color:#6b7280; font-style:italic; line-height:1.6; font-size:14px;">
          "${message.substring(0, 150)}${message.length > 150 ? "..." : ""}"
        </div>
      </div>

      <!-- CONTACT BUTTONS -->
      <div class="contact-buttons" style="display:flex; gap:12px; justify-content:center; margin-bottom:24px; flex-wrap:wrap;">
        <a href="https://wa.me/917092085864" style="display:inline-block; background:#25D366; color:#ffffff; padding:12px 24px; border-radius:25px; text-decoration:none; font-weight:600; font-size:13px; text-align:center;">
          CHAT ON WHATSAPP
        </a>
        <a href="tel:+917092085864" style="display:inline-block; background:#ffffff; color:#667eea; padding:12px 24px; border-radius:25px; text-decoration:none; font-weight:600; font-size:13px; border:2px solid #667eea; text-align:center;">
          CALL US NOW
        </a>
        <a href="mailto:abishek.sathiyan.2002@gmail.com" style="display:inline-block; background:#ffffff; color:#667eea; padding:12px 24px; border-radius:25px; text-decoration:none; font-weight:600; font-size:13px; border:2px solid #667eea; text-align:center;">
          SEND EMAIL
        </a>
      </div>

      <!-- INQUIRY ID -->
      <div style="background:#f8f9fa; padding:12px; text-align:center; border-radius:8px; font-size:12px; color:#6b7280;">
        <strong style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">INQUIRY ID: ${_id}</strong><br>
        Please keep this ID for reference
      </div>

      <div style="margin-top:20px; text-align:center; font-size:12px; color:#6b7280;">
        <a href="${ENV.CLIENT_URL || "http://localhost:5173"}" style="color:#667eea; text-decoration:none;">Visit VELSAKA TECH</a> for more information about our services.
      </div>

    </div>

    <!-- FOOTER -->
    <div style="background:#f8f9fa; text-align:center; padding:20px; border-top:1px solid #e5e7eb;">
      <div style="margin:12px 0;">
        <a href="https://github.com/AbishekSathiyan" style="color:#667eea; text-decoration:none; margin:0 12px; font-size:12px;">GITHUB</a> •
        <a href="https://www.linkedin.com/in/abishek04/" style="color:#667eea; text-decoration:none; margin:0 12px; font-size:12px;">LINKEDIN</a> •
        <a href="https://abisheksathiyan-portfolio-front-end.vercel.app/" style="color:#667eea; text-decoration:none; margin:0 12px; font-size:12px;">FOUNDER'S PORTFOLIO</a> •
        <a href="${ENV.CLIENT_URL || "http://localhost:5173"}" style="color:#667eea; text-decoration:none; margin:0 12px; font-size:12px;">VELSAKA TECH</a> •
        <a href="https://wa.me/917092085864" style="color:#667eea; text-decoration:none; margin:0 12px; font-size:12px;">WHATSAPP</a>
      </div>
      <div style="font-size:11px; color:#9ca3af;">
        © ${new Date().getFullYear()} VELSAKA TECH. All rights reserved.<br>
        Methalodai, Ramanathapuram, Tamil Nadu, India - 623532
      </div>
    </div>

  </div>

</body>
</html>
  `;

  try {
    const result = await transporter.sendMail({
      from: `"VELSAKA TECH Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Thank you for contacting VELSAKA TECH - We'll be in touch within 24 hours`,
      html: autoReplyTemplate,
      text: `
        THANK YOU FOR CONTACTING VELSAKA TECH
        
        Dear ${fullName},
        
        We've received your inquiry regarding ${service} services.
        
        WHAT HAPPENS NEXT:
        1. Quick Confirmation - Within 24 hours
        2. Detailed Consultation - Schedule a call
        3. Custom Proposal - Within 3-5 days
        4. Project Kickoff - Start building
        
        MEET THE FOUNDER:
        Abishek Sathiyan - Founder & Chief Architect
        View his portfolio: https://abisheksathiyan-portfolio-front-end.vercel.app/
        
        For immediate assistance:
        WhatsApp: +91 70920 85864
        Call: +91 70920 85864
        Email: abishek.sathiyan.2002@gmail.com
        
        Visit our website: ${ENV.CLIENT_URL || "http://localhost:5173"}
        
        Your Inquiry ID: ${_id}
        
        Best regards,
        VELSAKA TECH Team
        
        Innovation Beyond Borders
      `,
    });
    console.log("✅ Auto-reply email sent to:", email, result.response);
    return result;
  } catch (error) {
    console.error("❌ Failed to send auto-reply email:", error.message);
    return null; // FIX: prevent crash, return null instead of throwing
  }
};

// POST / - Submit contact form
router.post("/", async (req, res) => {
  console.log("📝 POST request received at /api/contact");
  console.log("Request body:", req.body);

  try {
    const { fullName, email, phone, service, message } = req.body;

    // Validation
    if (!fullName || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and message",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Phone validation (optional)
    if (phone) {
      const phoneRegex =
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid phone number",
        });
      }
    }

    // Save to database
    const contact = new Contact({
      fullName,
      email,
      phone: phone || "",
      service: service || "Web Development",
      message,
      status: "pending",
      createdAt: new Date(),
    });

    await contact.save();
    console.log("✅ Contact saved to database with ID:", contact._id);

    // FIX: Non-blocking email sending (prevents API timeout)
    // This sends emails in the background without waiting for response
    setImmediate(async () => {
      console.log("📧 Sending admin email notification...");
      await sendAdminEmailNotification(contact);
      
      console.log("📧 Sending auto-reply email to customer...");
      await sendAutoReplyEmail(contact);
    });

    res.status(201).json({
      success: true,
      message: "Thank you for reaching out! We will get back to you within 24 hours.",
      id: contact._id,
    });
  } catch (error) {
    console.error("❌ Contact form error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
});

// GET / - Get all contacts (Admin only)
router.get("/", async (req, res) => {
  console.log("📋 GET request received at /api/contact");

  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: contacts,
      total: contacts.length,
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch contacts",
    });
  }
});

// GET /:id - Get single contact
router.get("/:id", async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }
    res.json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error("Error fetching contact:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch contact",
    });
  }
});

// PUT /:id/status - Update contact status
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "read", "replied", "archived"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true },
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.json({
      success: true,
      message: "Status updated successfully",
      data: contact,
    });
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update contact status",
    });
  }
});

// DELETE /:id - Delete contact
router.delete("/:id", async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete contact",
    });
  }
});

// GET /stats/summary - Get contact statistics
router.get("/stats/summary", async (req, res) => {
  try {
    const total = await Contact.countDocuments();
    const pending = await Contact.countDocuments({ status: "pending" });
    const read = await Contact.countDocuments({ status: "read" });
    const replied = await Contact.countDocuments({ status: "replied" });
    const archived = await Contact.countDocuments({ status: "archived" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await Contact.countDocuments({
      createdAt: { $gte: today },
    });

    res.json({
      success: true,
      data: {
        total,
        pending,
        read,
        replied,
        archived,
        today: todayCount,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
    });
  }
});

export default router;