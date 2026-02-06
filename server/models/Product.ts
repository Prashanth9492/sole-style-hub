import { ObjectId } from 'mongodb';

export interface IProduct {
  _id?: ObjectId;
  name: string;
  slug: string;
  description: string;
  category: string;
  subCategory?: string;
  brand: string;
  price: number;
  salePrice?: number;
  discount?: number;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  sku: string;
  isFeatured: boolean;
  isNewArrival: boolean;
  specifications?: {
    material?: string;
    careInstructions?: string;
    [key: string]: any;
  };
  tags: string[];
  rating: number;
  reviewCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const collectionName = 'products';
