import express, { Request, Response } from 'express';
import { authenticateUser, AuthRequest } from '../middleware/auth';
import { createRazorpayOrder, verifyRazorpaySignature, fetchRazorpayPayment, processRazorpayRefund } from '../razorpay';

const router = express.Router();

// Create Razorpay order for checkout
router.post('/payment/create-order', authenticateUser, async (req: AuthRequest, res: Response) => {
  try {
    const { amount, currency, receipt } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    const order = await createRazorpayOrder(amount, currency || 'INR', receipt);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_SBkFF4ycVcZJRl'
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
});

// Verify Razorpay payment
router.post('/payment/verify', authenticateUser, async (req: AuthRequest, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing payment verification parameters' });
    }

    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return res.status(400).json({ 
        error: 'Payment verification failed',
        verified: false 
      });
    }

    // Fetch payment details from Razorpay
    const paymentDetails = await fetchRazorpayPayment(razorpay_payment_id);

    res.json({
      verified: true,
      message: 'Payment verified successfully',
      payment: {
        id: paymentDetails.id,
        amount: paymentDetails.amount / 100, // Convert from paise to rupees
        currency: paymentDetails.currency,
        status: paymentDetails.status,
        method: paymentDetails.method,
        email: paymentDetails.email,
        contact: paymentDetails.contact
      }
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

// Get payment details
router.get('/payment/:paymentId', authenticateUser, async (req: AuthRequest, res: Response) => {
  try {
    const { paymentId } = req.params;

    const payment = await fetchRazorpayPayment(paymentId);

    res.json({
      id: payment.id,
      amount: payment.amount / 100,
      currency: payment.currency,
      status: payment.status,
      method: payment.method,
      email: payment.email,
      contact: payment.contact,
      createdAt: new Date(payment.created_at * 1000)
    });
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({ error: 'Failed to fetch payment details' });
  }
});

// Process refund (Admin only)
router.post('/payment/refund', authenticateUser, async (req: AuthRequest, res: Response) => {
  try {
    const { paymentId, amount } = req.body;

    if (!paymentId) {
      return res.status(400).json({ error: 'Payment ID is required' });
    }

    const refund = await processRazorpayRefund(paymentId, amount);

    res.json({
      message: 'Refund processed successfully',
      refund: {
        id: refund.id,
        amount: refund.amount / 100,
        status: refund.status,
        paymentId: refund.payment_id
      }
    });
  } catch (error) {
    console.error('Error processing refund:', error);
    res.status(500).json({ error: 'Failed to process refund' });
  }
});

// Razorpay webhook endpoint
router.post('/payment/webhook', async (req: Request, res: Response) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'] as string;

    if (secret && signature) {
      const expectedSignature = require('crypto')
        .createHmac('sha256', secret)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (expectedSignature !== signature) {
        return res.status(400).json({ error: 'Invalid signature' });
      }
    }

    const event = req.body.event;
    const payload = req.body.payload.payment.entity;

    console.log('Razorpay Webhook Event:', event);

    // Handle different webhook events
    switch (event) {
      case 'payment.authorized':
        console.log('Payment authorized:', payload.id);
        break;
      case 'payment.captured':
        console.log('Payment captured:', payload.id);
        break;
      case 'payment.failed':
        console.log('Payment failed:', payload.id);
        break;
      case 'refund.created':
        console.log('Refund created:', payload.id);
        break;
      default:
        console.log('Unhandled event:', event);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;
