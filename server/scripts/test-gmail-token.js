import "dotenv/config";
import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
 process.env.GMAIL_CLIENT_ID,
 process.env.GMAIL_CLIENT_SECRET
);

oauth2Client.setCredentials({
 refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

try {
 const { token } = await oauth2Client.getAccessToken();

 const oauth2 = google.oauth2({
   auth: oauth2Client,
   version: "v2",
 });

 const { data } = await oauth2.userinfo.get();

 console.log("OAuth account:", data.email);
 console.log("EMAIL_USER:", process.env.EMAIL_USER);
 console.log("Match:", data.email === process.env.EMAIL_USER);
 console.log("Access token received:", !!token);
} catch (err) {
 console.error("FAILED");
 console.error(err.response?.data || err.message);
}
