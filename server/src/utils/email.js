import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // STARTTLS
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.GMAIL_CLIENT_SECRET,
    refreshToken: process.env.GMAIL_REFRESH_TOKEN,
  },
  tls: {
    // Upgrade the connection to TLS after connecting on port 587
    rejectUnauthorized: true,
  },
});

export async function sendPasswordResetEmail(to, token) {
  try {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    console.log("Sending password reset email:", {
      from: process.env.EMAIL_USER,
      to,
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: "Reset your password",
      html: `
        <p>You requested a password reset.</p>
        <p>Click the link below to reset your password:</p>
        <p>
          <a href="${resetUrl}">Reset your password</a>
        </p>
        <p>This link expires in 30 minutes.</p>
      `,
    });

    console.log("Password reset email sent to:", to);
  } catch (err) {
    console.error("Email sending error:", err);
    throw err;
  }
}