// src/services/templates/welcome.template.js

export const welcomeTemplate = (email) => {
  const logoUrl =
    "https://cdn.imageurlgenerator.com/uploads/4b20620d-1dec-4474-9994-121672d1169b.jpeg";

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Welcome to VelSAKA TECH</title>
  </head>

  <body style="margin:0;padding:0;background-color:#0B1120;font-family:Arial,sans-serif;">
    
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr>
        <td align="center">
          
          <table width="600" cellpadding="0" cellspacing="0" 
            style="background:#111827;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);">

            <!-- HEADER -->
            <tr>
              <td style="padding:30px;text-align:center;
                background:linear-gradient(135deg,#6C63FF,#3B82F6);">

                <img src="${logoUrl}" 
                     width="60" height="60"
                     style="border-radius:12px;margin-bottom:10px;" />

                <h1 style="color:#ffffff;margin:0;font-size:22px;">
                  VelSAKA TECH
                </h1>

                <p style="color:#e5e7eb;font-size:13px;margin-top:6px;">
                  Smart Tech • AI • SaaS Innovation
                </p>
              </td>
            </tr>

            <!-- BODY -->
            <tr>
              <td style="padding:30px;color:#e5e7eb;">

                <h2 style="color:#ffffff;margin-bottom:10px;">
                  You're on the Waitlist
                </h2>

                <p style="font-size:14px;line-height:1.7;color:#cbd5e1;">
                  Thank you for joining <b>VelSAKA TECH</b>.  
                  Your email (<span style="color:#ffffff;">${email}</span>) is successfully registered.
                </p>

                <!-- Info Box -->
                <table width="100%" style="margin-top:20px;background:#1F2937;border-radius:10px;">
                  <tr>
                    <td style="padding:15px;">
                      <p style="margin:0 0 10px 0;font-weight:bold;color:#ffffff;">
                        What you’ll receive:
                      </p>
                      <ul style="margin:0;padding-left:18px;color:#cbd5e1;font-size:14px;line-height:1.8;">
                        <li>• Early product access</li>
                        <li>• AI-powered tools updates</li>
                        <li>• Feature announcements</li>
                        <li>• Important company updates</li>
                      </ul>
                    </td>
                  </tr>
                </table>

                <!-- CTA -->
                <table width="100%" style="margin-top:25px;">
                  <tr>
                    <td align="center">
                      <a href="https://velsaka.tech"
                         style="display:inline-block;padding:12px 22px;
                         background:linear-gradient(135deg,#6C63FF,#3B82F6);
                         color:#ffffff;text-decoration:none;border-radius:8px;
                         font-weight:bold;font-size:14px;">
                        Visit Website
                      </a>
                    </td>
                  </tr>
                </table>

                <!-- Footer Note -->
                <p style="margin-top:25px;font-size:12px;color:#94a3b8;text-align:center;">
                  This is an automated message. Please do not reply.
                </p>

              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td style="padding:15px;text-align:center;
                font-size:12px;color:#64748b;
                border-top:1px solid rgba(255,255,255,0.05);">

                © ${new Date().getFullYear()} VelSAKA TECH. All rights reserved.

              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
};