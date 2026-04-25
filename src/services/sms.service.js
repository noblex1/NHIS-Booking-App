const axios = require("axios");
const logger = require("../utils/logger");

const provider = (process.env.SMS_PROVIDER || "twilio").toLowerCase();

async function sendViaTwilio(to, message) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;

  if (!sid || !token || !from) {
    logger.warn("Twilio credentials missing. Logging SMS instead.", { to, message });
    return;
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
  const payload = new URLSearchParams({
    To: to,
    From: from,
    Body: message,
  });

  await axios.post(url, payload.toString(), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    auth: {
      username: sid,
      password: token,
    },
    timeout: 10000,
  });
}

async function sendViaHubtel(to, message) {
  const clientId = process.env.HUBTEL_CLIENT_ID;
  const clientSecret = process.env.HUBTEL_CLIENT_SECRET;
  const senderId = process.env.HUBTEL_SENDER_ID || process.env.SMS_SENDER_ID || "NHIS";
  const baseUrl = process.env.HUBTEL_API_BASE_URL || "https://sms.hubtel.com/v1/messages";

  if (!clientId || !clientSecret) {
    logger.warn("Hubtel credentials missing. Logging SMS instead.", { to, message });
    return;
  }

  await axios.post(
    baseUrl,
    {
      From: senderId,
      To: to,
      Content: message,
    },
    {
      headers: { "Content-Type": "application/json" },
      auth: {
        username: clientId,
        password: clientSecret,
      },
      timeout: 10000,
    },
  );
}

async function sendSMS(to, message) {
  if (provider === "hubtel") {
    await sendViaHubtel(to, message);
    return;
  }

  await sendViaTwilio(to, message);
}

module.exports = {
  sendSMS,
};
