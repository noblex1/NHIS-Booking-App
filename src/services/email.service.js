const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");
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
 * Sends mail via SendGrid when SENDGRID_API_KEY is set; otherwise SMTP.
 * If neither SendGrid nor SMTP is configured, returns false (caller logs dev-only behaviour).
 */
async function deliverMail(mailOptions, logLabel) {
  const apiKey = process.env.SENDGRID_API_KEY?.trim();
  if (apiKey) {
    sgMail.setApiKey(apiKey);
    try {
      const [resp] = await sgMail.send({
        to: mailOptions.to,
        from: mailOptions.from,
        subject: mailOptions.subject,
        text: mailOptions.text,
        html: mailOptions.html,
      });
      logger.info(`${logLabel} sent via SendGrid`, {
        to: mailOptions.to,
        statusCode: resp.statusCode,
      });
      return true;
    } catch (error) {
      const detail = error.response?.body
        ? JSON.stringify(error.response.body)
        : error.message;
      logger.error(`SendGrid failed (${logLabel})`, {
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
      logger.info("Email would be sent (no SendGrid key and SMTP not configured)", {
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
async function sendAppointmentConfirmation(to, date, timeSlot) {
  const { fromHeader } = resolveFromAddress();

  const mailOptions = {
    from: fromHeader,
    to,
    subject: "NHIS Appointment Confirmation",
    text: `Your appointment has been confirmed for ${date} at ${timeSlot}.\n\nThank you for using NHIS Appointment System.`,
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
            <h1>✅ Appointment Confirmed</h1>
          </div>
          
          <p>Your appointment has been successfully confirmed!</p>
          
          <div class="appointment-details">
            <div class="detail-row">
              <span class="detail-label">📅 Date:</span>
              <span class="detail-value">${date}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">🕐 Time:</span>
              <span class="detail-value">${timeSlot}</span>
            </div>
          </div>
          
          <p style="text-align: center; margin-top: 20px;">
            Please arrive 10 minutes before your scheduled time.
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
        "Appointment confirmation would be sent (no SendGrid key and SMTP not configured)",
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
