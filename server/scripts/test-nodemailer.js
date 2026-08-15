import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.GMAIL_CLIENT_SECRET,
    refreshToken: process.env.GMAIL_REFRESH_TOKEN,
  },
});

try {
  await transporter.verify();

  console.log("SUCCESS: Nodemailer authenticated with Gmail.");
} catch (err) {
  console.error("FAILED: Nodemailer could not authenticate.");
  console.error(err);
}