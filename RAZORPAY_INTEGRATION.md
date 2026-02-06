# Razorpay Payment Integration Guide

## 🎯 Overview

This guide covers the complete Razorpay payment gateway integration for **Sole Style Hub**. The integration supports online payments (UPI, Cards, Netbanking, Wallets) alongside Cash on Delivery (COD).

## 🔑 Test Credentials

```env
RAZORPAY_KEY_ID=rzp_test_SBIw4RkdH1qRYH
RAZORPAY_KEY_SECRET=ZsrI2res8fs8JKEOs8CpVup0
```

⚠️ **Note**: These are test credentials. Replace with production keys before going live.

---

## 🏗️ Architecture

### Backend Components

1. **Razorpay Configuration** (`server/razorpay.ts`)
   - Razorpay SDK initialization
   - Order creation utilities
   - Payment verification helpers
   - Refund processing functions

2. **Payment Routes** (`server/routes/payment.ts`)
   - `/api/payment/create-order` - Creates Razorpay order
   - `/api/payment/verify` - Verifies payment signature
   - `/api/payment/:paymentId` - Fetches payment details
   - `/api/payment/refund` - Processes refunds
   - `/api/payment/webhook` - Handles Razorpay webhooks

3. **Order Integration** (`server/routes/orders.ts`)
   - Automatically creates Razorpay order for online payments
   - Stores `razorpayOrderId`, `razorpayPaymentId`, `razorpaySignature`
   - Updates payment status after verification

### Frontend Components

1. **Razorpay Checkout Component** (`src/components/payment/RazorpayCheckout.tsx`)
   - Loads Razorpay script dynamically
   - Opens payment modal
   - Handles success/failure callbacks
   - Integrates with toast notifications

2. **Checkout Page** (`src/pages/CheckoutPage.tsx`)
   - Address management
   - Payment method selection (COD/Online)
   - Order summary
   - Payment flow orchestration

---

## 🔄 Payment Flow

### 1. User Selects Online Payment

```
User → Cart → Checkout → Select "Online Payment" → Place Order
```

### 2. Backend Creates Razorpay Order

```typescript
// Order creation endpoint automatically creates Razorpay order
POST /api/orders
{
  "items": [...],
  "paymentMethod": "ONLINE",
  "totalAmount": 1999
}

// Response includes Razorpay order details
{
  "orderId": "507f1f77bcf86cd799439011",
  "orderNumber": "ORD-20250201-ABC123",
  "razorpayOrder": {
    "id": "order_MN...xyz",
    "amount": 199900, // in paise
    "currency": "INR",
    "key": "rzp_test_..."
  }
}
```

### 3. Frontend Opens Razorpay Checkout

```typescript
// Razorpay modal opens with order details
const options = {
  key: razorpayKey,
  amount: amount * 100,
  currency: 'INR',
  order_id: razorpayOrderId,
  prefill: { name, email, contact },
  handler: (response) => {
    // Payment successful - verify
  }
};
new Razorpay(options).open();
```

### 4. User Completes Payment

- User chooses payment method (UPI/Card/Netbanking/Wallet)
- Enters payment details
- Completes authentication (OTP/PIN)
- Payment processed by Razorpay

### 5. Payment Verification

```typescript
// Frontend sends verification request
POST /api/payment/verify
{
  "razorpay_order_id": "order_...",
  "razorpay_payment_id": "pay_...",
  "razorpay_signature": "abc123...",
  "orderId": "507f1f77bcf86cd799439011"
}

// Backend verifies signature using HMAC SHA256
const expectedSignature = crypto
  .createHmac('sha256', RAZORPAY_KEY_SECRET)
  .update(order_id + '|' + payment_id)
  .digest('hex');

if (expectedSignature === razorpay_signature) {
  // Update order status to PAID
  // Clear user's cart
  // Redirect to success page
}
```

---

## 📝 API Reference

### Create Razorpay Order

```http
POST /api/payment/create-order
Content-Type: application/json
Authorization: Bearer <token>

{
  "amount": 1999,
  "currency": "INR",
  "receipt": "ORD-20250201-ABC123"
}
```

**Response:**
```json
{
  "order": {
    "id": "order_MN...xyz",
    "entity": "order",
    "amount": 199900,
    "amount_paid": 0,
    "amount_due": 199900,
    "currency": "INR",
    "receipt": "ORD-20250201-ABC123",
    "status": "created"
  }
}
```

### Verify Payment

```http
POST /api/payment/verify
Content-Type: application/json
Authorization: Bearer <token>

{
  "razorpay_order_id": "order_MN...xyz",
  "razorpay_payment_id": "pay_MN...abc",
  "razorpay_signature": "abc123...",
  "orderId": "507f1f77bcf86cd799439011"
}
```

**Response:**
```json
{
  "verified": true,
  "message": "Payment verified successfully",
  "order": {
    "orderNumber": "ORD-20250201-ABC123",
    "paymentStatus": "PAID"
  }
}
```

### Fetch Payment Details

```http
GET /api/payment/pay_MN...abc
Authorization: Bearer <token>
```

**Response:**
```json
{
  "payment": {
    "id": "pay_MN...abc",
    "amount": 199900,
    "currency": "INR",
    "status": "captured",
    "method": "upi",
    "email": "user@example.com",
    "contact": "+919876543210",
    "created_at": 1675234567
  }
}
```

### Process Refund

```http
POST /api/payment/refund
Content-Type: application/json
Authorization: Bearer <token>

{
  "paymentId": "pay_MN...abc",
  "amount": 199900
}
```

**Response:**
```json
{
  "refund": {
    "id": "rfnd_MN...xyz",
    "payment_id": "pay_MN...abc",
    "amount": 199900,
    "currency": "INR",
    "status": "processed"
  }
}
```

---

## 💾 Database Schema Updates

### Order Model Fields

```typescript
interface IOrder {
  // ... existing fields
  
  // Razorpay fields
  razorpayOrderId?: string;      // Razorpay order ID
  razorpayPaymentId?: string;    // Payment ID after success
  razorpaySignature?: string;    // Signature for verification
  
  paymentStatus: PaymentStatus;  // PENDING | PAID | FAILED
}
```

---

## 🧪 Testing

### Test Cards (Razorpay Test Mode)

| Card Number         | Type       | CVV  | Expiry    | Behavior |
|---------------------|------------|------|-----------|----------|
| 4111 1111 1111 1111 | Visa       | Any  | Any future| Success  |
| 5555 5555 5555 4444 | Mastercard | Any  | Any future| Success  |
| 3782 822463 10005   | Amex       | Any  | Any future| Success  |
| 4000 0000 0000 0002 | Visa       | Any  | Any future| Failed   |

### Test UPI IDs
- `success@razorpay` - Successful payment
- `failure@razorpay` - Failed payment

### Test Netbanking
- Select any bank in test mode
- Use any credentials to complete payment

### Testing Steps

1. **Start the application:**
   ```bash
   npm run dev
   ```

2. **Add items to cart** and proceed to checkout

3. **Select "Online Payment"** method

4. **Click "Place Order"** - Razorpay modal opens

5. **Choose payment method:**
   - UPI: Use `success@razorpay`
   - Card: Use `4111 1111 1111 1111`
   - Netbanking: Select any bank

6. **Complete payment** and verify:
   - Order status updated to "PAID"
   - Cart cleared
   - Redirected to order confirmation

---

## 🔒 Security Best Practices

### 1. Environment Variables
```env
# Never commit these to Git!
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

### 2. Signature Verification
Always verify payment signatures on the backend:

```typescript
import crypto from 'crypto';

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const text = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(text)
    .digest('hex');
  
  return expectedSignature === signature;
}
```

### 3. Webhook Authentication
Verify webhook signatures:

```typescript
const webhookSignature = req.headers['x-razorpay-signature'];
const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

const isValid = verifyWebhookSignature(
  req.body,
  webhookSignature,
  webhookSecret
);
```

### 4. HTTPS Only
- Always use HTTPS in production
- Razorpay requires HTTPS for live mode

### 5. Amount Validation
- Store amounts in database in actual currency (₹1999)
- Convert to paise (× 100) only for Razorpay API
- Verify amounts on backend before creating order

---

## 🚀 Production Deployment

### 1. Get Production Credentials
1. Login to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Complete KYC verification
3. Navigate to Settings → API Keys
4. Generate production keys

### 2. Update Environment Variables
```env
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
```

### 3. Configure Webhooks
1. Go to Settings → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/payment/webhook`
3. Select events:
   - `payment.captured`
   - `payment.failed`
   - `refund.created`
4. Copy webhook secret and add to `.env`

### 4. Update Frontend
```typescript
// Use production URL
const API_URL = 'https://api.youromain.com';
```

### 5. Enable Payment Methods
- Go to Settings → Configuration
- Enable desired payment methods:
  - ✅ Cards (Visa, Mastercard, Amex, RuPay)
  - ✅ UPI (Google Pay, PhonePe, Paytm)
  - ✅ Netbanking (All major banks)
  - ✅ Wallets (Paytm, Mobikwik, etc.)

---

## 📊 Order Status Flow

```
┌─────────────┐
│   PLACED    │ ← Order created
└──────┬──────┘
       │
       ├─ COD ─────────────────────→ PENDING (Payment)
       │
       └─ ONLINE ──┐
                   │
            ┌──────▼──────┐
            │   PENDING   │ ← Awaiting payment
            └──────┬──────┘
                   │
         ┌─────────┴─────────┐
         │                   │
    ┌────▼────┐         ┌────▼────┐
    │  PAID   │         │ FAILED  │
    └────┬────┘         └─────────┘
         │
    ┌────▼────────┐
    │  CONFIRMED  │ ← Admin confirms
    └────┬────────┘
         │
    ┌────▼────────┐
    │  PROCESSING │
    └────┬────────┘
         │
    ┌────▼────────┐
    │  SHIPPED    │
    └────┬────────┘
         │
    ┌────▼────────┐
    │  DELIVERED  │
    └─────────────┘
```

---

## 🐛 Troubleshooting

### Payment Modal Not Opening

**Issue:** Razorpay script not loaded

**Solution:**
```typescript
// Check script load status
useEffect(() => {
  if (!scriptLoaded) {
    console.log('Razorpay script still loading...');
  }
}, [scriptLoaded]);
```

### Signature Verification Failed

**Issue:** Incorrect HMAC calculation

**Solution:**
```typescript
// Ensure exact format: order_id|payment_id
const text = `${orderId}|${paymentId}`;
// No spaces, no extra characters
```

### Payment Successful but Order Not Updated

**Issue:** Verification endpoint not called

**Solution:**
- Check frontend `onSuccess` callback
- Verify API endpoint URL
- Check authentication token

### Amount Mismatch

**Issue:** Incorrect amount conversion

**Solution:**
```typescript
// ✅ Correct
const amountInPaise = amount * 100;

// ❌ Wrong
const amountInPaise = amount; // Forgot to multiply
```

---

## 📈 Analytics & Reporting

### Payment Success Rate

```typescript
// Get payment statistics
GET /api/analytics/payments
```

### Revenue by Payment Method

```typescript
// MongoDB aggregation
db.orders.aggregate([
  { $group: {
    _id: "$paymentMethod",
    totalRevenue: { $sum: "$finalAmount" },
    count: { $sum: 1 }
  }}
]);
```

### Failed Payments Report

```typescript
// Find failed payments
db.orders.find({
  paymentMethod: "ONLINE",
  paymentStatus: "FAILED"
});
```

---

## 📞 Support

### Razorpay Support
- Dashboard: https://dashboard.razorpay.com/
- Docs: https://razorpay.com/docs/
- Support: support@razorpay.com

### Internal Support
- Backend issues: Check server logs
- Frontend issues: Check browser console
- Payment issues: Check Razorpay Dashboard → Payments

---

## ✅ Checklist

### Development
- [x] Install Razorpay SDK
- [x] Configure test credentials
- [x] Create payment routes
- [x] Integrate with orders
- [x] Build checkout UI
- [x] Test payment flow

### Production
- [ ] Get production credentials
- [ ] Update environment variables
- [ ] Configure webhooks
- [ ] Enable payment methods
- [ ] Test on staging
- [ ] Deploy to production
- [ ] Monitor transactions

---

## 📚 Additional Resources

- [Razorpay Payment Gateway Docs](https://razorpay.com/docs/payment-gateway/)
- [Razorpay Checkout.js Reference](https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/)
- [Payment Webhooks Guide](https://razorpay.com/docs/webhooks/)
- [Test Cards & UPI](https://razorpay.com/docs/payments/payments/test-card-details/)
