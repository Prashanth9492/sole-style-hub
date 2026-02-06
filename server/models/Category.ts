import { ObjectId } from 'mongodb';

export interface ISubCategory {
  _id?: ObjectId;
  name: string;
  slug: string;
  image?: string;
  isActive: boolean;
}

export interface ICategory {
  _id?: ObjectId;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentCategory?: string; // For main categories: 'Men', 'Women', 'Kids'
  subCategories: ISubCategory[];
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export const collectionName = 'categories';
