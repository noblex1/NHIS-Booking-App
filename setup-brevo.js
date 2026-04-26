/**
 * Interactive Brevo Setup Script
 * 
 * This script helps you configure Brevo credentials in your .env file
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setup() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║         🔐 Brevo (Sendinblue) Setup Wizard               ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  console.log('📋 Before you begin, make sure you have:');
  console.log('   1. Created a Brevo account at https://www.brevo.com');
  console.log('   2. Verified your email address');
  console.log('   3. Generated an SMTP key from Settings → SMTP & API\n');

  const proceed = await question('Do you have your Brevo credentials ready? (yes/no): ');
  
  if (proceed.toLowerCase() !== 'yes' && proceed.toLowerCase() !== 'y') {
    console.log('\n📖 Please follow these steps:');
    console.log('   1. Visit: https://www.brevo.com');
    console.log('   2. Sign up for a free account');
    console.log('   3. Go to Settings → SMTP & API');
    console.log('   4. Generate a new SMTP key');
    console.log('   5. Run this script again\n');
    console.log('📚 For detailed instructions, see: BREVO_SETUP_GUIDE.md\n');
    rl.close();
    return;
  }

  console.log('\n📧 Enter your Brevo credentials:\n');

  const email = await question('Brevo Login Email: ');
  const smtpKey = await question('Brevo SMTP Key: ');
  const fromName = await question('Email From Name (default: NHIS Appointment System): ') || 'NHIS Appointment System';

  console.log('\n🔍 Validating credentials...\n');

  // Basic validation
  if (!email || !email.includes('@')) {
    console.log('❌ Invalid email address');
    rl.close();
    return;
  }

  if (!smtpKey || smtpKey.length < 10) {
    console.log('❌ SMTP key seems too short. Please check and try again.');
    rl.close();
    return;
  }

  // Read current .env file
  const envPath = path.join(__dirname, '.env');
  let envContent = '';

  try {
    envContent = fs.readFileSync(envPath, 'utf8');
  } catch (error) {
    console.log('❌ Could not read .env file');
    rl.close();
    return;
  }

  // Update Brevo credentials
  envContent = envContent.replace(
    /BREVO_SMTP_USER=.*/,
    `BREVO_SMTP_USER=${email}`
  );
  envContent = envContent.replace(
    /BREVO_SMTP_PASS=.*/,
    `BREVO_SMTP_PASS=${smtpKey}`
  );
  envContent = envContent.replace(
    /EMAIL_FROM_NAME=.*/,
    `EMAIL_FROM_NAME=${fromName}`
  );

  // Write back to .env
  try {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Credentials saved to .env file\n');
  } catch (error) {
    console.log('❌ Could not write to .env file');
    rl.close();
    return;
  }

  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║                  ✅ Setup Complete!                        ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  console.log('📧 Your Brevo configuration:');
  console.log(`   Email: ${email}`);
  console.log(`   From Name: ${fromName}`);
  console.log(`   SMTP Key: ${smtpKey.substring(0, 10)}...`);

  console.log('\n🧪 Next steps:');
  console.log('   1. Test your email configuration:');
  console.log(`      node test-email.js ${email}`);
  console.log('   2. Start the server:');
  console.log('      npm run dev');
  console.log('   3. Test the registration API\n');

  const testNow = await question('Would you like to test email sending now? (yes/no): ');
  
  if (testNow.toLowerCase() === 'yes' || testNow.toLowerCase() === 'y') {
    console.log('\n🧪 Testing email service...\n');
    rl.close();
    
    // Run test script
    const { spawn } = require('child_process');
    const testProcess = spawn('node', ['test-email.js', email], {
      stdio: 'inherit'
    });

    testProcess.on('close', (code) => {
      if (code === 0) {
        console.log('\n✅ Email test completed successfully!');
      } else {
        console.log('\n⚠️  Email test encountered issues. Check the output above.');
      }
    });
  } else {
    console.log('\n👍 You can test later by running:');
    console.log(`   node test-email.js ${email}\n`);
    rl.close();
  }
}

setup().catch(error => {
  console.error('❌ Setup failed:', error.message);
  rl.close();
});
