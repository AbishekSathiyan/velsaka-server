export const welcomeTemplate = (email) => {
  return `
    <div style="font-family:Arial, sans-serif; background:#0B1120; color:#fff; padding:30px;">
      
      <div style="max-width:600px; margin:auto; background:#111827; padding:30px; border-radius:12px; border:1px solid #1f2937;">
        
        <h2 style="color:#6C63FF; margin-bottom:10px;">
          🚀 Welcome to VELSAKA TECH
        </h2>

        <p style="color:#c7c4d8; font-size:14px;">
          Hi <strong>${email}</strong>,
        </p>

        <p style="color:#c7c4d8; font-size:14px;">
          You're officially on the waitlist 🎉
        </p>

        <p style="color:#c7c4d8; font-size:14px;">
          We’re building powerful AI tools to help developers grow faster:
        </p>

        <ul style="color:#c7c4d8; font-size:14px; line-height:1.6;">
          <li>⚡ AI Resume Builder</li>
          <li>📁 Portfolio Generator</li>
          <li>🧠 AI Interview Prep</li>
        </ul>

        <p style="color:#c7c4d8; font-size:14px;">
          We'll notify you as soon as we launch.
        </p>

        <div style="margin-top:20px;">
          <a href="https://velsaka.tech" 
             style="background:#6C63FF; color:#fff; padding:10px 20px; text-decoration:none; border-radius:8px;">
            Visit Website
          </a>
        </div>

        <p style="margin-top:30px; font-size:12px; color:#6b7280;">
          — VELSAKA TECH Team
        </p>

      </div>
    </div>
  `;
};