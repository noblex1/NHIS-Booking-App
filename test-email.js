/**
 * Test script for email (SendGrid if SENDGRID_API_KEY is set, else SMTP).
 *
 * Usage:
 *   node test-email.js your-email@example.com
 */

require("dotenv").config();
const { sendOtpEmail, sendAppointmentConfirmation } = require("./src/services/email.service");

const testEmail = process.argv[2];

if (!testEmail) {
  console.error("❌ Please provide an email address as argument");
  console.log("Usage: node test-email.js your-email@example.com");
  process.exit(1);
}

const hasSendGrid = Boolean(process.env.SENDGRID_API_KEY?.trim());
const hasSmtp =
  process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;

if (!hasSendGrid && !hasSmtp) {
  console.error("❌ Configure either SendGrid or SMTP in .env");
  console.log("\nOption A — SendGrid (production):");
  console.log("  SENDGRID_API_KEY=SG...");
  console.log("  EMAIL_FROM=verified-sender@yourdomain.com");
  console.log("\nOption B — SMTP (local/dev):");
  console.log("  SMTP_HOST (e.g., smtp.gmail.com)");
  console.log("  SMTP_USER, SMTP_PASS");
  process.exit(1);
}

async function testEmailService() {
  console.log("🧪 Testing email service\n");
  console.log("Configuration:");
  if (hasSendGrid) {
    console.log("  Provider: SendGrid (SENDGRID_API_KEY set)");
    console.log(`  From: ${process.env.EMAIL_FROM || process.env.SMTP_USER || "(default)"}`);
  } else {
    console.log(`  Provider: SMTP (${process.env.SMTP_HOST})`);
    console.log(`  SMTP User: ${process.env.SMTP_USER}`);
  }
  console.log(`  Test recipient: ${testEmail}\n`);

  try {
    // Test 1: OTP Email
    console.log("📧 Test 1: Sending OTP email...");
    const testOtp = "123456";
    await sendOtpEmail(testEmail, testOtp);
    console.log("✅ OTP email sent successfully!\n");

    // Test 2: Appointment Confirmation Email
    console.log("📧 Test 2: Sending appointment confirmation email...");
    const testDate = "2026-05-15";
    const testTimeSlot = "10:30 AM";
    await sendAppointmentConfirmation(testEmail, testDate, testTimeSlot);
    console.log("✅ Appointment confirmation email sent successfully!\n");

    console.log("🎉 All tests passed!");
    console.log(`\n📬 Check your inbox at ${testEmail}`);
    console.log("   (Don't forget to check spam/junk folder)\n");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.error("\nTroubleshooting:");
    if (hasSendGrid) {
      console.error("  1. SendGrid API key is valid (full access Mail Send)");
      console.error("  2. EMAIL_FROM matches a verified sender in SendGrid");
    } else {
      console.error("  1. Verify SMTP credentials are correct");
      console.error("  2. For Gmail, use App Password (not regular password)");
    }
    console.error("     → https://myaccount.google.com/apppasswords");
    console.error("  3. Enable 2-Step Verification for Gmail");
    console.error("  4. Check if 'Less secure app access' is enabled (if not using App Password)");
    console.error("  5. Ensure the email address is valid");
    console.error("  6. Check your internet connection");
    console.error("\nError details:", error);
    process.exit(1);
  }
}

testEmailService();
