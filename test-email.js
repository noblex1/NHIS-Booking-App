/**
 * Test script for email (Brevo if BREVO_API_KEY is set, else SMTP).
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

const hasBrevo = Boolean(process.env.BREVO_API_KEY?.trim());
const hasSmtp =
  process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;

if (!hasBrevo && !hasSmtp) {
  console.error("❌ Configure either Brevo or SMTP in .env");
  console.log("\nOption A — Brevo (production):");
  console.log("  BREVO_API_KEY=xkeysib-...");
  console.log("  EMAIL_FROM=verified-sender@yourdomain.com");
  console.log("  Get API key: https://app.brevo.com/settings/keys/api");
  console.log("\nOption B — SMTP (local/dev):");
  console.log("  SMTP_HOST (e.g., smtp.gmail.com)");
  console.log("  SMTP_USER, SMTP_PASS");
  process.exit(1);
}

async function testEmailService() {
  console.log("🧪 Testing email service\n");
  console.log("Configuration:");
  if (hasBrevo) {
    console.log("  Provider: Brevo (BREVO_API_KEY set)");
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
    
    if (hasBrevo) {
      console.log("💡 Tip: Check Brevo dashboard for delivery status:");
      console.log("   https://app.brevo.com/statistics/email\n");
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.error("\nTroubleshooting:");
    if (hasBrevo) {
      console.error("  Brevo Issues:");
      console.error("  1. Verify your API key is correct");
      console.error("     → Get from: https://app.brevo.com/settings/keys/api");
      console.error("  2. Check if sender email is verified in Brevo");
      console.error("     → https://app.brevo.com/senders");
      console.error("  3. Check Brevo dashboard for errors");
      console.error("     → https://app.brevo.com/statistics/email");
      console.error("  4. Ensure you haven't exceeded daily limit (300 emails/day on free tier)");
    } else {
      console.error("  SMTP Issues:");
      console.error("  1. Verify SMTP credentials are correct");
      console.error("  2. For Gmail, use App Password (not regular password)");
      console.error("     → https://myaccount.google.com/apppasswords");
      console.error("  3. Enable 2-Step Verification for Gmail");
    }
    console.error("\nError details:", error);
    process.exit(1);
  }
}

testEmailService();
