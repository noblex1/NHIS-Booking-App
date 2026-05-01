/**
 * Email Delivery Status Checker
 * 
 * This script helps diagnose email delivery issues
 */

require("dotenv").config();

console.log("📧 Email Configuration Status Check\n");
console.log("=" .repeat(60));

// Check environment variables
console.log("\n1️⃣  Environment Variables:");
console.log("   SMTP_HOST:", process.env.SMTP_HOST || "❌ Missing");
console.log("   SMTP_PORT:", process.env.SMTP_PORT || "587 (default)");
console.log("   SMTP_SECURE:", process.env.SMTP_SECURE || "false (default)");
console.log("   SMTP_USER:", process.env.SMTP_USER ? "✅ Set" : "❌ Missing");
console.log("   SMTP_PASS:", process.env.SMTP_PASS ? "✅ Set" : "❌ Missing");
console.log("   EMAIL_FROM:", process.env.EMAIL_FROM || process.env.SMTP_USER || "❌ Not set");
console.log("   EMAIL_FROM_NAME:", process.env.EMAIL_FROM_NAME || "NHIS Appointment System");

// Check SMTP configuration
console.log("\n2️⃣  SMTP Configuration:");
if (process.env.SMTP_HOST) {
  console.log("   Host:", process.env.SMTP_HOST);
  console.log("   Port:", process.env.SMTP_PORT || 587);
  console.log("   Security:", process.env.SMTP_SECURE === "true" ? "SSL/TLS" : "STARTTLS");
  console.log("   User:", process.env.SMTP_USER || "Not configured");
  
  // Detect provider
  const host = process.env.SMTP_HOST.toLowerCase();
  if (host.includes("gmail")) {
    console.log("   Provider: Gmail");
  } else if (host.includes("outlook") || host.includes("office365")) {
    console.log("   Provider: Outlook/Office365");
  } else if (host.includes("yahoo")) {
    console.log("   Provider: Yahoo");
  } else {
    console.log("   Provider: Custom SMTP");
  }
} else {
  console.log("   ❌ SMTP not configured");
}

// Recommendations
console.log("\n3️⃣  Recommendations:");
console.log("");

if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.log("   ❌ Missing SMTP credentials!");
  console.log("   → Add SMTP_HOST, SMTP_USER, and SMTP_PASS to .env file");
  console.log("");
  console.log("   For Gmail:");
  console.log("   SMTP_HOST=smtp.gmail.com");
  console.log("   SMTP_PORT=587");
  console.log("   SMTP_SECURE=false");
  console.log("   SMTP_USER=your-email@gmail.com");
  console.log("   SMTP_PASS=your-app-password");
} else {
  console.log("   ✅ SMTP credentials configured");
  
  if (process.env.SMTP_HOST.includes("gmail")) {
    console.log("");
    console.log("   📝 Gmail Setup Checklist:");
    console.log("   □ Enable 2-Step Verification");
    console.log("   □ Generate App Password at: https://myaccount.google.com/apppasswords");
    console.log("   □ Use App Password (not regular password) in SMTP_PASS");
  }
}

// Next steps
console.log("\n4️⃣  Next Steps:");
console.log("");

if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  console.log("   1. Test Email Sending:");
  console.log("      → Run: node test-email.js your-email@example.com");
  console.log("");
  console.log("   2. Check Email Inbox:");
  console.log("      → Inbox, Spam, Promotions, All Mail");
  console.log("");
  console.log("   3. If using Gmail and emails don't arrive:");
  console.log("      → Make sure you're using App Password");
  console.log("      → Check: https://myaccount.google.com/apppasswords");
} else {
  console.log("   1. Configure SMTP credentials in .env file");
  console.log("   2. See .env.example for configuration examples");
  console.log("   3. Run this script again to verify configuration");
}

console.log("");
console.log("=" .repeat(60));
console.log("\n💡 Common SMTP Providers:");
console.log("");
console.log("   Gmail:");
console.log("   SMTP_HOST=smtp.gmail.com");
console.log("   SMTP_PORT=587");
console.log("   Requires: App Password (https://myaccount.google.com/apppasswords)");
console.log("");
console.log("   Outlook/Office365:");
console.log("   SMTP_HOST=smtp-mail.outlook.com");
console.log("   SMTP_PORT=587");
console.log("");
console.log("   Yahoo:");
console.log("   SMTP_HOST=smtp.mail.yahoo.com");
console.log("   SMTP_PORT=587");
console.log("");
console.log("📚 See GMAIL_SMTP_SETUP.md for detailed Gmail setup guide\n");
