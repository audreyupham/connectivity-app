import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_PORT == 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendPasswordResetEmail(email, token) {
  const resetLink =
    `${process.env.FRONTEND_URL}/reset-password/${token}`;

  await transporter.sendMail({
    from: `"My Contacts App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset your password",
    html: `
      <h2>Password Reset</h2>

      <p>You requested a password reset.</p>

      <p>
        <a href="${resetLink}">
          Click here to reset your password
        </a>
      </p>

      <p>This link expires in 30 minutes.</p>

      <p>If you didn't request this, you can ignore this email.</p>
    `,
  });
}