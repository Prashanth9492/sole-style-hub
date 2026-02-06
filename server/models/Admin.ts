import { ObjectId } from 'mongodb';

export enum AdminRole {
  ADMIN = 'admin',
  SUB_ADMIN = 'sub-admin'
}

export interface IAdmin {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  role: AdminRole;
  permissions: {
    canManageProducts: boolean;
    canManageOrders: boolean;
    canManageCategories: boolean;
    canManageCustomers: boolean;
    canManageAdmins: boolean;
    canViewAnalytics: boolean;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const collectionName = 'admins';
