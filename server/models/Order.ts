import { ObjectId } from 'mongodb';

export enum PaymentStatus {
  PENDING = 'Pending',
  PAID = 'Paid',
  FAILED = 'Failed'
}

export enum OrderStatus {
  PLACED = 'Placed',
  CONFIRMED = 'Confirmed',
  PACKED = 'Packed',
  SHIPPED = 'Shipped',
  OUT_FOR_DELIVERY = 'Out for Delivery',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled',
  RETURNED = 'Returned'
}

export interface IOrderItem {
  productId: ObjectId;
  productName: string;
  productImage: string;
  size?: string;
  color?: string;
  quantity: number;
  price: number;
  discount?: number;
  subtotal: number;
}

export interface IShippingAddress {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface IOrder {
  _id?: ObjectId;
  orderNumber: string;
  userId: ObjectId;
  userEmail: string;
  userName: string;
  items: IOrderItem[];
  totalAmount: number;
  discount: number;
  shippingCharges: number;
  taxAmount: number;
  finalAmount: number;
  shippingAddress: IShippingAddress;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  orderStatus: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    timestamp: Date;
    comment?: string;
  }[];
  trackingNumber?: string;
  estimatedDelivery?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const collectionName = 'orders';
