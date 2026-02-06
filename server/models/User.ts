import { ObjectId } from 'mongodb';

export interface IAddress {
  _id?: ObjectId;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface IUser {
  _id?: ObjectId;
  firebaseUid?: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  addresses: IAddress[];
  orderHistory: ObjectId[];
  wishlist: ObjectId[];
  cart: {
    productId: ObjectId;
    quantity: number;
    size?: string;
  }[];
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const collectionName = 'users';
