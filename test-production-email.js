/**
 * Production Email Configuration Test
 * 
 * This script tests if your production email configuration is working.
 * Run this on your production server or with production environment variables.
 */

require('dotenv').config();
const axios = require('axios');

async function testProductionEmail() {
  console.log('🧪 Testing Production Email Configuration');
  console.log('=' .repeat(60));
  console.log();
  
  // Check environment
  console.log('📦 Environment:');
  console.log(`  NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  Platform: ${process.env.RENDER ? 'Render' : process.env.DYNO ? 'Heroku' : process.env.RAILWAY_ENVIRONMENT ? 'Railway' : 'Unknown'}`);
  console.log();
  
  // Check environment variables
  console.log('🔑 Environment Variables:');
  const hasApiKey = !!process.env.BREVO_API_KEY?.trim();
  const hasEmailFrom = !!process.env.EMAIL_FROM?.trim();
  const hasEmailFromName = !!process.env.EMAIL_FROM_NAME?.trim();
  
  console.log(`  BREVO_API_KEY: ${hasApiKey ? '✅ Set' : '❌ NOT SET'}`);
  if (hasApiKey) {
    const key = process.env.BREVO_API_KEY.trim();
    console.log(`    - Length: ${key.length} characters`);
    console.log(`    - Prefix: ${key.substring(0, 15)}...`);
    console.log(`    - Valid format: ${key.startsWith('xkeysib-') ? '✅ Yes' : '⚠️  No'}`);
  }
  
  console.log(`  EMAIL_FROM: ${hasEmailFrom ? '✅ ' + process.env.EMAIL_FROM : '❌ NOT SET'}`);
  console.log(`  EMAIL_FROM_NAME: ${hasEmailFromName ? '✅ ' + process.env.EMAIL_FROM_NAME : '⚠️  Not set (will use default)'}`);
  console.log();
  
  // Check if we can proceed
  if (!hasApiKey) {
    console.error('❌ CRITICAL: BREVO_API_KEY is not set!');
    console.log();
    console.log('🔧 How to fix:');
    console.log('  1. Get API key from: https://app.brevo.com/settings/keys/api');
    console.log('  2. Set it in your production environment:');
    console.log();
    console.log('  For Render:');
    console.log('    Dashboard → Service → Environment → Add Variable');
    console.log('    BREVO_API_KEY = xkeysib-your-key-here');
    console.log();
    console.log('  For Heroku:');
    console.log('    heroku config:set BREVO_API_KEY=xkeysib-your-key-here');
    console.log();
    console.log('  For Railway:');
    console.log('    Project → Service → Variables → New Variable');
    console.log();
    return;
  }
  
  if (!hasEmailFrom) {
    console.error('❌ CRITICAL: EMAIL_FROM is not set!');
    console.log();
    console.log('🔧 How to fix:');
    console.log('  Set EMAIL_FROM in your production environment:');
    console.log('  EMAIL_FROM = sharifiddrisu156@gmail.com');
    console.log();
    return;
  }
  
  // Test Brevo API
  console.log('🌐 Testing Brevo API Connection...');
  console.log();
  
  const testEmail = process.env.EMAIL_FROM; // Send test to yourself
  
  try {
    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: {
          name: process.env.EMAIL_FROM_NAME || 'NHIS Appointment System',
          email: process.env.EMAIL_FROM
        },
        to: [{ email: testEmail }],
        subject: '🧪 Production Email Test - NHIS Booking',
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .container { max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 30px; border-radius: 8px; }
              h1 { color: #10b981; }
              .success { background: #d1fae5; padding: 15px; border-radius: 5px; margin: 20px 0; }
              .info { background: #e0e7ff; padding: 15px; border-radius: 5px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>✅ Production Email Test Successful!</h1>
              <div class="success">
                <strong>Great news!</strong> Your production email configuration is working correctly.
              </div>
              <div class="info">
                <strong>Test Details:</strong><br>
                - Environment: ${process.env.NODE_ENV || 'development'}<br>
                - Sender: ${process.env.EMAIL_FROM}<br>
                - Provider: Brevo API<br>
                - Time: ${new Date().toISOString()}
              </div>
              <p>Your NHIS Booking App can now send OTP and appointment confirmation emails in production.</p>
              <p style="color: #666; font-size: 12px; margin-top: 30px;">
                This is an automated test email from your NHIS Booking App.
              </p>
            </div>
          </body>
          </html>
        `,
        textContent: `Production Email Test Successful!\n\nYour production email configuration is working correctly.\n\nEnvironment: ${process.env.NODE_ENV}\nSender: ${process.env.EMAIL_FROM}\nProvider: Brevo API\nTime: ${new Date().toISOString()}`
      },
      {
        headers: {
          'accept': 'application/json',
          'api-key': process.env.BREVO_API_KEY.trim(),
          'content-type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      }
    );
    
    console.log('✅ SUCCESS! Email sent via Brevo API');
    console.log();
    console.log('📧 Email Details:');
    console.log(`  Message ID: ${response.data.messageId}`);
    console.log(`  Recipient: ${testEmail}`);
    console.log(`  Status: Sent`);
    console.log();
    console.log('📬 Next Steps:');
    console.log(`  1. Check your inbox: ${testEmail}`);
    console.log('  2. Check spam/junk folder if not in inbox');
    console.log('  3. Check Brevo dashboard: https://app.brevo.com/statistics/email');
    console.log();
    console.log('🎉 Your production email is working! Registration should work now.');
    console.log();
    
  } catch (error) {
    console.error('❌ FAILED! Email could not be sent');
    console.log();
    
    if (error.response) {
      // Brevo API returned an error
      console.log('📋 Error Details:');
      console.log(`  Status: ${error.response.status} ${error.response.statusText}`);
      console.log(`  Message: ${JSON.stringify(error.response.data, null, 2)}`);
      console.log();
      
      // Provide specific fixes based on error
      if (error.response.status === 401) {
        console.log('🔧 Fix: Invalid or expired API key');
        console.log('  1. Go to: https://app.brevo.com/settings/keys/api');
        console.log('  2. Generate a new API key');
        console.log('  3. Update BREVO_API_KEY in production environment');
        console.log('  4. Redeploy or restart your service');
        
      } else if (error.response.data?.message?.toLowerCase().includes('sender')) {
        console.log('🔧 Fix: Sender email not verified');
        console.log('  1. Go to: https://app.brevo.com/senders');
        console.log(`  2. Verify sender email: ${process.env.EMAIL_FROM}`);
        console.log('  3. Check your email for verification link');
        console.log('  4. Click the link to verify');
        console.log('  5. Try again after verification');
        
      } else if (error.response.status === 429) {
        console.log('🔧 Fix: Rate limit exceeded');
        console.log('  1. You have exceeded the daily sending limit (300 emails/day on free tier)');
        console.log('  2. Wait 24 hours for limit reset');
        console.log('  3. Or upgrade your Brevo plan');
        console.log('  4. Check usage: https://app.brevo.com/statistics/email');
        
      } else {
        console.log('🔧 Troubleshooting:');
        console.log('  1. Check Brevo dashboard: https://app.brevo.com/');
        console.log('  2. Verify account is active');
        console.log('  3. Check for any account issues or suspensions');
        console.log('  4. Contact Brevo support if issue persists');
      }
      
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      console.log('📋 Error: Network connection failed');
      console.log(`  Code: ${error.code}`);
      console.log(`  Message: ${error.message}`);
      console.log();
      console.log('🔧 Fix: Network/Firewall issue');
      console.log('  1. Check if production server can reach api.brevo.com');
      console.log('  2. Verify outbound HTTPS (port 443) is allowed');
      console.log('  3. Check firewall rules');
      console.log('  4. Test connection: curl https://api.brevo.com');
      
    } else {
      console.log('📋 Error:', error.message);
      console.log();
      console.log('🔧 General troubleshooting:');
      console.log('  1. Check production logs for more details');
      console.log('  2. Verify all environment variables are set correctly');
      console.log('  3. Ensure latest code is deployed');
      console.log('  4. Try restarting your production service');
    }
    
    console.log();
    console.log('📚 Full documentation: See PRODUCTION_EMAIL_FIX.md');
    console.log();
    
    process.exit(1);
  }
}

// Run the test
console.log();
testProductionEmail().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
