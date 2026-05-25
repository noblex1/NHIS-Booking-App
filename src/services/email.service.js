const nodemailer = require("nodemailer");
const axios = require("axios");
const logger = require("../utils/logger");

function resolveFromAddress() {
  const fromEmail = process.env.EMAIL_FROM || process.env.SMTP_USER || "noreply@nhis.com";
  const fromName = process.env.EMAIL_FROM_NAME || "NHIS Appointment System";
  return {
    fromEmail,
    fromName,
    fromHeader: `"${fromName}" <${fromEmail}>`,
  };
}

/**
 * Sends mail via Brevo when BREVO_API_KEY is set; otherwise SMTP.
 * If neither Brevo nor SMTP is configured, returns false (caller logs dev-only behaviour).
 */
/**
 * Sends mail via Brevo when BREVO_API_KEY is set; otherwise SMTP.
 * If neither Brevo nor SMTP is configured, returns false (caller logs dev-only behaviour).
 */
async function deliverMail(mailOptions, logLabel) {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  if (apiKey) {
    try {
      // Use Brevo REST API directly
      const response = await axios.post(
        'https://api.brevo.com/v3/smtp/email',
        {
          sender: {
            name: resolveFromAddress().fromName,
            email: resolveFromAddress().fromEmail
          },
          to: [{ email: mailOptions.to }],
          subject: mailOptions.subject,
          htmlContent: mailOptions.html,
          textContent: mailOptions.text
        },
        {
          headers: {
            'accept': 'application/json',
            'api-key': apiKey,
            'content-type': 'application/json'
          }
        }
      );

      logger.info(`${logLabel} sent via Brevo`, {
        to: mailOptions.to,
        messageId: response.data.messageId,
      });
      return true;
    } catch (error) {
      const detail = error.response?.data
        ? JSON.stringify(error.response.data)
        : error.message;
      logger.error(`Brevo failed (${logLabel})`, {
        to: mailOptions.to,
        error: detail,
      });
      throw error;
    }
  }

  const transporter = createEmailTransporter();
  if (!transporter) {
    return false;
  }

  const info = await transporter.sendMail(mailOptions);
  logger.info(`${logLabel} sent via SMTP`, {
    to: mailOptions.to,
    messageId: info.messageId,
  });
  return true;
}

/**
 * Create SMTP transporter
 * Supports Gmail, Outlook, Yahoo, and custom SMTP servers
 */
function createEmailTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const secure = process.env.SMTP_SECURE === "true"; // true for 465, false for other ports
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    logger.warn("SMTP credentials missing. Email sending will be logged only.");
    logger.warn("Required: SMTP_HOST, SMTP_USER, SMTP_PASS");
    return null;
  }

  const transportConfig = {
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  };

  // Add additional options for Gmail
  if (host.includes("gmail")) {
    transportConfig.service = "gmail";
  }

  logger.info("Email transporter configured", {
    host,
    port,
    secure,
    user,
  });

  return nodemailer.createTransport(transportConfig);
}

/**
 * Send OTP verification email
 * @param {string} to - Recipient email address
 * @param {string} otpCode - OTP code to send
 */
async function sendOtpEmail(to, otpCode) {
  const { fromHeader } = resolveFromAddress();
  const expiryMinutes = process.env.OTP_EXPIRY_MINUTES || 5;

  const mailOptions = {
    from: fromHeader,
    to,
    subject: "NHIS Verification Code",
    text: `Your NHIS verification code is: ${otpCode}\n\nThis code expires in ${expiryMinutes} minutes.\n\nIf you did not request this code, please ignore this email.`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background-color: #f9f9f9;
            border-radius: 8px;
            padding: 30px;
            border: 1px solid #e0e0e0;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #2563eb;
            margin: 0;
            font-size: 24px;
          }
          .otp-code {
            background-color: #2563eb;
            color: white;
            font-size: 32px;
            font-weight: bold;
            text-align: center;
            padding: 20px;
            border-radius: 8px;
            letter-spacing: 8px;
            margin: 20px 0;
          }
          .message {
            text-align: center;
            margin: 20px 0;
            font-size: 16px;
          }
          .expiry {
            text-align: center;
            color: #666;
            font-size: 14px;
            margin-top: 20px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            color: #999;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏥 NHIS Appointment System</h1>
          </div>
          
          <div class="message">
            <p>Your verification code is:</p>
          </div>
          
          <div class="otp-code">
            ${otpCode}
          </div>
          
          <div class="expiry">
            <p>⏱️ This code expires in <strong>${expiryMinutes} minutes</strong></p>
          </div>
          
          <div class="footer">
            <p>If you did not request this code, please ignore this email.</p>
            <p>&copy; ${new Date().getFullYear()} NHIS Appointment System. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const sent = await deliverMail(mailOptions, "OTP email");
    if (!sent) {
      logger.info("Email would be sent (no Brevo key and SMTP not configured)", {
        to,
        subject: mailOptions.subject,
        otpCode,
      });
    }
  } catch (error) {
    logger.error("Failed to send OTP email", { to, error: error.message });
    throw error;
  }
}

/**
 * Send appointment confirmation email
 * @param {string} to - Recipient email address
 * @param {string} date - Appointment date
 * @param {string} timeSlot - Appointment time slot
 */
const SERVICE_TYPE_LABELS = {
  new_registration: "New NHIS registration",
  renewal: "NHIS renewal",
};

const SLOT_PERIOD_LABELS = {
  morning: "Morning (8:00 AM – 11:00 AM)",
  afternoon: "Afternoon (12:00 PM – 3:00 PM)",
  evening: "Evening (4:00 PM – 6:00 PM)",
};

async function sendAppointmentConfirmation(to, details) {
  const {
    date,
    timeSlot,
    serviceType = "renewal",
    referenceNumber,
    centreName,
    feeAmount = 0,
  } = details;
  const { fromHeader } = resolveFromAddress();
  const serviceLabel = SERVICE_TYPE_LABELS[serviceType] || "NHIS service";
  const periodLabel = SLOT_PERIOD_LABELS[timeSlot] || timeSlot;
  const feeLine =
    feeAmount > 0
      ? `Fee: GHS ${feeAmount} (pay at centre or use your payment reference if provided).`
      : "No online fee for this service.";

  const mailOptions = {
    from: fromHeader,
    to,
    subject: `NHIS application confirmed — ${referenceNumber}`,
    text: `Reference: ${referenceNumber}\nService: ${serviceLabel}\nCentre: ${centreName}\nDate: ${date}\nTime: ${periodLabel}\n${feeLine}\n\nBring required documents and arrive 10 minutes early.`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background-color: #f9f9f9;
            border-radius: 8px;
            padding: 30px;
            border: 1px solid #e0e0e0;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #10b981;
            margin: 0;
            font-size: 24px;
          }
          .appointment-details {
            background-color: white;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            border-left: 4px solid #10b981;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e0e0e0;
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .detail-label {
            font-weight: bold;
            color: #666;
          }
          .detail-value {
            color: #333;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            color: #999;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Centre visit confirmed</h1>
          </div>
          
          <p>Your NHIA service centre booking is confirmed.</p>
          
          <div class="appointment-details">
            <div class="detail-row">
              <span class="detail-label">Reference:</span>
              <span class="detail-value">${referenceNumber}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Service:</span>
              <span class="detail-value">${serviceLabel}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Centre:</span>
              <span class="detail-value">${centreName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">📅 Date:</span>
              <span class="detail-value">${date}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">🕐 Time:</span>
              <span class="detail-value">${periodLabel}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Fee:</span>
              <span class="detail-value">${feeAmount > 0 ? `GHS ${feeAmount}` : "None"}</span>
            </div>
          </div>
          
          <p style="text-align: center; margin-top: 20px;">
            Bring valid ID and required documents. Arrive 10 minutes before your slot.
          </p>
          
          <div class="footer">
            <p>Thank you for using NHIS Appointment System</p>
            <p>&copy; ${new Date().getFullYear()} NHIS. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const sent = await deliverMail(mailOptions, "Appointment confirmation email");
    if (!sent) {
      logger.info(
        "Appointment confirmation would be sent (no Brevo key and SMTP not configured)",
        {
          to,
          date,
          timeSlot,
        },
      );
    }
  } catch (error) {
    logger.error("Failed to send appointment confirmation email", {
      to,
      error: error.message,
    });
    throw error;
  }
}

module.exports = {
  sendOtpEmail,
  sendAppointmentConfirmation,
};
