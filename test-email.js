/**
 * Test script for SMTP email service
 * 
 * Usage:
 *   node test-email.js your-email@example.com
 * 
 * Make sure to set SMTP credentials in .env first
 */

require("dotenv").config();
const { sendOtpEmail, sendAppointmentConfirmation } = require("./src/services/email.service");

const testEmail = process.argv[2];

if (!testEmail) {
  console.error("❌ Please provide an email address as argument");
  console.log("Usage: node test-email.js your-email@example.com");
  process.exit(1);
}

if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.error("❌ Missing SMTP credentials in .env file");
  console.log("Required variables:");
  console.log("  - SMTP_HOST (e.g., smtp.gmail.com)");
  console.log("  - SMTP_PORT (e.g., 587)");
  console.log("  - SMTP_USER (your email address)");
  console.log("  - SMTP_PASS (your app password)");
  console.log("\n💡 For Gmail, you need to generate an App Password:");
  console.log("   https://myaccount.google.com/apppasswords");
  process.exit(1);
}

async function testEmailService() {
  console.log("🧪 Testing SMTP Email Service\n");
  console.log("Configuration:");
  console.log(`  SMTP Host: ${process.env.SMTP_HOST}`);
  console.log(`  SMTP Port: ${process.env.SMTP_PORT || 587}`);
  console.log(`  SMTP User: ${process.env.SMTP_USER}`);
  console.log(`  Test Email: ${testEmail}\n`);

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
    console.error("  1. Verify SMTP credentials are correct");
    console.error("  2. For Gmail, use App Password (not regular password)");
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
