/**
 * Test script for Brevo email service
 * 
 * Usage:
 *   node test-email.js your-email@example.com
 * 
 * Make sure to set BREVO_SMTP_USER and BREVO_SMTP_PASS in .env first
 */

require("dotenv").config();
const { sendOtpEmail, sendAppointmentConfirmation } = require("./src/services/email.service");

const testEmail = process.argv[2];

if (!testEmail) {
  console.error("❌ Please provide an email address as argument");
  console.log("Usage: node test-email.js your-email@example.com");
  process.exit(1);
}

if (!process.env.BREVO_SMTP_USER || !process.env.BREVO_SMTP_PASS) {
  console.error("❌ Missing Brevo credentials in .env file");
  console.log("Required variables:");
  console.log("  - BREVO_SMTP_USER");
  console.log("  - BREVO_SMTP_PASS");
  process.exit(1);
}

async function testEmailService() {
  console.log("🧪 Testing Brevo Email Service\n");
  console.log("Configuration:");
  console.log(`  SMTP User: ${process.env.BREVO_SMTP_USER}`);
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
    console.error("  1. Verify Brevo credentials are correct");
    console.error("  2. Check if your Brevo account is active");
    console.error("  3. Ensure the email address is valid");
    console.error("  4. Check your internet connection");
    process.exit(1);
  }
}

testEmailService();
