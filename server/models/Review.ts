import { ObjectId } from 'mongodb';

export interface IReview {
  _id?: ObjectId;
  productId: ObjectId;
  userId: ObjectId;
  orderId: ObjectId;
  userName: string;
  userEmail: string;
  rating: number; // 1-5
  title?: string;
  comment: string;
  images?: string[]; // Array of image URLs
  videos?: string[]; // Array of video URLs
  isVerifiedPurchase: boolean;
  helpfulCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export const collectionName = 'reviews';
