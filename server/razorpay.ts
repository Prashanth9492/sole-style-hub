import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay instance
export const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_SBkFF4ycVcZJRl',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'YOdYFi75V1BWQmeZb4d2qr0I'
});

// Verify Razorpay payment signature
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  try {
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'YOdYFi75V1BWQmeZb4d2qr0I')
      .update(body.toString())
      .digest('hex');
    
    return expectedSignature === signature;
  } catch (error) {
    console.error('Error verifying Razorpay signature:', error);
    return false;
  }
}

// Create Razorpay order
export async function createRazorpayOrder(amount: number, currency: string = 'INR', receipt?: string) {
  try {
    const options = {
      amount: Math.round(amount * 100), // Convert to paise/cents
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1 // Auto capture
    };

    const order = await razorpayInstance.orders.create(options);
    return order;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
}

// Fetch Razorpay payment details
export async function fetchRazorpayPayment(paymentId: string) {
  try {
    const payment = await razorpayInstance.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    console.error('Error fetching Razorpay payment:', error);
    throw error;
  }
}

// Process refund
export async function processRazorpayRefund(paymentId: string, amount?: number) {
  try {
    const refund = await razorpayInstance.payments.refund(paymentId, {
      amount: amount ? Math.round(amount * 100) : undefined
    });
    return refund;
  } catch (error) {
    console.error('Error processing Razorpay refund:', error);
    throw error;
  }
}

export default razorpayInstance;
