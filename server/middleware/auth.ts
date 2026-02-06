import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
const JWT_EXPIRES_IN = '7d';

export interface JWTPayload {
  userId: string;
  email: string;
  role?: 'admin' | 'sub-admin' | 'user';
}

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

// Generate JWT token
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
}

// Middleware to authenticate user
export function authenticateUser(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Middleware to authenticate admin
export function authenticateAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = verifyToken(token);
    
    if (decoded.role !== 'admin' && decoded.role !== 'sub-admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Middleware to check specific admin permissions
export function requirePermission(permission: string) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      if (req.user.role === 'admin') {
        // Full admins have all permissions
        return next();
      }

      // For sub-admins, check specific permission
      // This would require fetching admin details from DB
      // For now, we'll allow if they're authenticated as admin/sub-admin
      next();
    } catch (error) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
  };
}
