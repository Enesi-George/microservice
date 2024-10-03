import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
    user?: { userId: string };
}

export const authToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: "Token is not provided" });
        return;  
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err: any, decoded: any) => {
        if (err) {
            console.error('JWT verification error:', err);
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: "Token has expired" });
            }
            if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: "Invalid token" });
            }
            return res.status(403).json({ message: "Failed to authenticate token" });
        }
        
        req.user = { userId: decoded.userId };
        next();
    });
};
