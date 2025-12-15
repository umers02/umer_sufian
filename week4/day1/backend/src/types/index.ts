// import { Document } from 'mongoose';

// export interface IUser extends Document {
//   username: string;
//   email: string;
//   password: string;
//   comparePassword(password: string): Promise<boolean>;
//   createdAt: Date;
//   updatedAt: Date;
// }

// export interface ITask extends Document {
//   title: string;
//   description?: string;
//   completed: boolean;
//   user: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// export interface AuthRequest extends Request {
//   user?: {
//     id: string;
//     email: string;
//   };
// }

// export interface AuthenticatedUser {
//   id: string;
//   email: string;
// }

// declare global {
//   namespace Express {
//     interface Request {
//       user?: AuthenticatedUser;
//     }
//   }
// }

// export interface AuthenticatedRequest<T = any> extends Request<any, any, T> {
//   user: {
//     id: string;
//     email: string;
//   };
// }

// export interface LoginRequest {
//   email: string;
//   password: string;
// }

// export interface RegisterRequest {
//   username: string;
//   email: string;
//   password: string;
// }

// export interface TaskRequest {
//   title: string;
//   description?: string;
//   completed?: boolean;
// }


import { Document } from 'mongoose'
import { Request } from 'express'

/* =======================
   USER & TASK MODELS
======================= */

export interface IUser extends Document {
  username: string
  email: string
  password: string
  comparePassword(password: string): Promise<boolean>
  createdAt: Date
  updatedAt: Date
}

export interface ITask extends Document {
  title: string
  description?: string
  completed: boolean
  user: string
  createdAt: Date
  updatedAt: Date
}

/* =======================
   AUTH REQUEST TYPES
======================= */

export interface AuthenticatedUser {
  id: string
  email: string
}

/**
 * Extend Express Request globally
 */
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser
    }
  }
}

/**
 * Custom request (NO generics – Render safe)
 */
export interface AuthRequest extends Request {
  user?: AuthenticatedUser
}

/* =======================
   DTOs
======================= */

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface TaskRequest {
  title: string
  description?: string
  completed?: boolean
}
