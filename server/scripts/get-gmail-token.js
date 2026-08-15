import "dotenv/config";

import { google } from "googleapis";
import open from "open";
import readline from "readline";


console.log("CLIENT ID:", process.env.GMAIL_CLIENT_ID);
console.log("CLIENT SECRET:", process.env.GMAIL_CLIENT_SECRET);


const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  "urn:ietf:wg:oauth:2.0:oob"
);

const url = oauth2Client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: [
    "https://mail.google.com/",
    "email",
    "profile"
  ],
});


console.log("Authorize this app by visiting this url:", url);
open(url);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter the code from that page here: ", async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  console.log("Your refresh token:", tokens.refresh_token);
  rl.close();
});
