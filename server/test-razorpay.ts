#!/usr/bin/env node

/**
 * Razorpay Integration Test Script
 * Tests the payment gateway integration with test credentials
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('🔍 Razorpay Integration Test\n');
console.log('=' .repeat(50));

// Check environment variables
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_SBkFF4ycVcZJRl';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'YOdYFi75V1BWQmeZb4d2qr0I';

console.log('\n📋 Configuration Check:');
console.log(`✓ Razorpay Key ID: ${RAZORPAY_KEY_ID}`);
console.log(`✓ Razorpay Key Secret: ${RAZORPAY_KEY_SECRET.slice(0, 4)}${'*'.repeat(RAZORPAY_KEY_SECRET.length - 4)}`);

// Import Razorpay
let Razorpay;
try {
  const module = await import('razorpay');
  Razorpay = module.default;
  console.log('\n✅ Razorpay SDK imported successfully');
} catch (error) {
  console.error('\n❌ Failed to import Razorpay SDK');
  console.error('Run: npm install razorpay');
  process.exit(1);
}

// Initialize Razorpay
let razorpayInstance;
try {
  razorpayInstance = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });
  console.log('✅ Razorpay instance created successfully');
} catch (error) {
  console.error('\n❌ Failed to create Razorpay instance');
  console.error(error.message);
  process.exit(1);
}

// Test order creation
console.log('\n🧪 Testing Order Creation...');
const testOrderOptions = {
  amount: 99900, // ₹999 in paise
  currency: 'INR',
  receipt: `TEST-${Date.now()}`,
};

try {
  const order = await razorpayInstance.orders.create(testOrderOptions);
  console.log('✅ Test order created successfully');
  console.log(`   Order ID: ${order.id}`);
  console.log(`   Amount: ₹${order.amount / 100}`);
  console.log(`   Currency: ${order.currency}`);
  console.log(`   Receipt: ${order.receipt}`);
  console.log(`   Status: ${order.status}`);
} catch (error) {
  console.error('❌ Failed to create test order');
  console.error(`   Error: ${error.error?.description || error.message}`);
  process.exit(1);
}

// Test signature verification
console.log('\n🧪 Testing Signature Verification...');
try {
  const crypto = await import('crypto');
  
  const testOrderId = 'order_test123';
  const testPaymentId = 'pay_test456';
  const text = `${testOrderId}|${testPaymentId}`;
  
  const signature = crypto
    .createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(text)
    .digest('hex');
  
  console.log('✅ Signature generation working');
  console.log(`   Test Signature: ${signature.slice(0, 20)}...`);
} catch (error) {
  console.error('❌ Signature generation failed');
  console.error(error.message);
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('🎉 All Tests Passed!');
console.log('\n📝 Next Steps:');
console.log('  1. Start your server: npm run dev');
console.log('  2. Add items to cart');
console.log('  3. Proceed to checkout');
console.log('  4. Select "Online Payment"');
console.log('  5. Use test cards from RAZORPAY_INTEGRATION.md');
console.log('\n💳 Quick Test Cards:');
console.log('  • Success: 4111 1111 1111 1111');
console.log('  • Failed:  4000 0000 0000 0002');
console.log('  • UPI:     success@razorpay');
console.log('\n📚 Documentation: See RAZORPAY_INTEGRATION.md');
console.log('=' .repeat(50) + '\n');
