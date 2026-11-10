import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin.ts';
import { db } from '../db/index.ts';
import { profiles } from '../db/schema.ts';
import { eq } from 'drizzle-orm';

export interface AuthRequest extends Request {
  user?: any;
  profile?: any;
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
    
    // Check if profile exists in SQL
    let [profile] = await db.select().from(profiles).where(eq(profiles.uid, decodedToken.uid));
    
    if (!profile) {
      // Create profile on first sign-in
      const [newProfile] = await db.insert(profiles).values({
        uid: decodedToken.uid,
        email: decodedToken.email!,
        role: decodedToken.email === 'saifalimansuri92@gmail.com' ? 'owner' : 'customer'
      }).returning();
      profile = newProfile;
    }
    
    req.profile = profile;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

export const requireAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  await requireAuth(req, res, () => {
    if (req.profile?.role === 'admin' || req.profile?.role === 'owner') {
      next();
    } else {
      res.status(403).json({ error: 'Forbidden: Admin access required' });
    }
  });
};
