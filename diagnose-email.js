/**
 * Email Configuration Diagnostic Tool
 * 
 * This script checks your email configuration and identifies issues
 * without actually sending emails.
 */

require("dotenv").config();

console.log("🔍 NHIS Email Configuration Diagnostic\n");
console.log("=" .repeat(60));

// Check Node environment
console.log("\n📦 Environment:");
console.log(`  NODE_ENV: ${process.env.NODE_ENV || "(not set)"}`);
console.log(`  Node Version: ${process.version}`);

// Check Brevo Configuration
console.log("\n🔑 Brevo Configuration:");
const brevoKey = process.env.BREVO_API_KEY?.trim();
if (brevoKey) {
  console.log(`  ✅ BREVO_API_KEY: Set (${brevoKey.substring(0, 20)}...)`);
  
  // Validate key format
  if (brevoKey.startsWith("xkeysib-")) {
    console.log("  ✅ API Key Format: Valid (starts with 'xkeysib-')");
  } else {
    console.log("  ⚠️  API Key Format: Invalid (should start with 'xkeysib-')");
  }
  
  // Check key length (typical Brevo keys are ~80 chars)
  if (brevoKey.length > 70) {
    console.log(`  ✅ API Key Length: Valid (${brevoKey.length} characters)`);
  } else {
    console.log(`  ⚠️  API Key Length: Suspicious (${brevoKey.length} characters, expected ~80)`);
  }
} else {
  console.log("  ❌ BREVO_API_KEY: Not set");
}

// Check Email From
console.log("\n📧 Email Sender Configuration:");
const emailFrom = process.env.EMAIL_FROM?.trim();
if (emailFrom) {
  console.log(`  ✅ EMAIL_FROM: ${emailFrom}`);
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(emailFrom)) {
    console.log("  ✅ Email Format: Valid");
  } else {
    console.log("  ⚠️  Email Format: Invalid");
  }
} else {
  console.log("  ⚠️  EMAIL_FROM: Not set (will use default)");
}

const emailFromName = process.env.EMAIL_FROM_NAME?.trim();
if (emailFromName) {
  console.log(`  ✅ EMAIL_FROM_NAME: ${emailFromName}`);
} else {
  console.log("  ⚠️  EMAIL_FROM_NAME: Not set (will use default)");
}

// Check SMTP Configuration (Fallback)
console.log("\n🌐 SMTP Fallback Configuration:");
const smtpHost = process.env.SMTP_HOST?.trim();
const smtpPort = process.env.SMTP_PORT?.trim();
const smtpUser = process.env.SMTP_USER?.trim();
const smtpPass = process.env.SMTP_PASS?.trim();
const smtpSecure = process.env.SMTP_SECURE?.trim();

if (smtpHost && smtpUser && smtpPass) {
  console.log(`  ✅ SMTP_HOST: ${smtpHost}`);
  console.log(`  ✅ SMTP_PORT: ${smtpPort || "587 (default)"}`);
  console.log(`  ✅ SMTP_USER: ${smtpUser}`);
  console.log(`  ✅ SMTP_PASS: Set (${smtpPass.length} characters)`);
  console.log(`  ✅ SMTP_SECURE: ${smtpSecure || "false (default)"}`);
  console.log("  ✅ SMTP Fallback: Configured");
} else {
  console.log("  ℹ️  SMTP Fallback: Not configured (optional)");
  if (!brevoKey) {
    console.log("  ⚠️  Warning: Neither Brevo nor SMTP is configured!");
  }
}

// Check OTP Configuration
console.log("\n🔐 OTP Configuration:");
console.log(`  OTP_EXPIRY_MINUTES: ${process.env.OTP_EXPIRY_MINUTES || "5 (default)"}`);
console.log(`  OTP_LENGTH: ${process.env.OTP_LENGTH || "6 (default)"}`);
console.log(`  OTP_MAX_ATTEMPTS: ${process.env.OTP_MAX_ATTEMPTS || "5 (default)"}`);

// Overall Status
console.log("\n" + "=".repeat(60));
console.log("\n📊 Overall Status:\n");

let hasErrors = false;
let hasWarnings = false;

if (!brevoKey && (!smtpHost || !smtpUser || !smtpPass)) {
  console.log("❌ CRITICAL: No email service configured!");
  console.log("   → Configure either Brevo API or SMTP in .env file");
  hasErrors = true;
} else if (brevoKey) {
  if (!brevoKey.startsWith("xkeysib-")) {
    console.log("⚠️  WARNING: Brevo API key format looks invalid");
    console.log("   → Get a valid key from: https://app.brevo.com/settings/keys/api");
    hasWarnings = true;
  } else {
    console.log("✅ Brevo API is configured");
    if (smtpHost && smtpUser && smtpPass) {
      console.log("✅ SMTP fallback is also configured");
    }
  }
} else if (smtpHost && smtpUser && smtpPass) {
  console.log("✅ SMTP is configured (Brevo not set)");
}

if (!emailFrom) {
  console.log("⚠️  WARNING: EMAIL_FROM not set, will use default");
  hasWarnings = true;
}

console.log("\n" + "=".repeat(60));

// Recommendations
console.log("\n💡 Recommendations:\n");

if (hasErrors) {
  console.log("🔴 CRITICAL ISSUES FOUND - Email sending will fail!\n");
  console.log("Quick Fix Options:\n");
  console.log("Option 1 - Use Brevo (Recommended for Production):");
  console.log("  1. Get API key: https://app.brevo.com/settings/keys/api");
  console.log("  2. Add to .env: BREVO_API_KEY=xkeysib-...");
  console.log("  3. Verify sender: https://app.brevo.com/senders");
  console.log("  4. Add to .env: EMAIL_FROM=your-verified-email@example.com\n");
  
  console.log("Option 2 - Use Gmail SMTP (Quick for Development):");
  console.log("  1. Enable 2-Step Verification on Gmail");
  console.log("  2. Create App Password: https://myaccount.google.com/apppasswords");
  console.log("  3. Add to .env:");
  console.log("     SMTP_HOST=smtp.gmail.com");
  console.log("     SMTP_PORT=587");
  console.log("     SMTP_SECURE=false");
  console.log("     SMTP_USER=your-email@gmail.com");
  console.log("     SMTP_PASS=your-16-char-app-password\n");
} else if (hasWarnings) {
  console.log("🟡 WARNINGS FOUND - Email might not work correctly\n");
  console.log("Please review the warnings above and fix them.\n");
} else {
  console.log("🟢 Configuration looks good!\n");
  console.log("Next Steps:");
  console.log("  1. Test email sending: node test-email.js your-email@example.com");
  console.log("  2. If test passes, try registration flow");
  console.log("  3. Check Brevo dashboard: https://app.brevo.com/statistics/email\n");
}

// Test command
console.log("=" .repeat(60));
console.log("\n🧪 Ready to test? Run:\n");
console.log("  node test-email.js your-email@example.com\n");
console.log("=" .repeat(60) + "\n");
