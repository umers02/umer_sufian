import { Document } from 'mongoose';
import { Request } from 'express';
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    comparePassword(password: string): Promise<boolean>;
    createdAt: Date;
    updatedAt: Date;
}
export interface ITask extends Document {
    title: string;
    description?: string;
    completed: boolean;
    user: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface AuthenticatedUser {
    id: string;
    email: string;
}
/**
 * Extend Express Request globally
 */
declare global {
    namespace Express {
        interface Request {
            user?: AuthenticatedUser;
        }
    }
}
/**
 * Custom request (NO generics – Render safe)
 */
export interface AuthRequest extends Request {
    user?: AuthenticatedUser;
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}
export interface TaskRequest {
    title: string;
    description?: string;
    completed?: boolean;
}
//# sourceMappingURL=index.d.ts.map