import { Request, Response } from 'express';
import { RegisterRequest, LoginRequest } from '../types';
export declare const register: (req: Request<{}, {}, RegisterRequest>, res: Response) => Promise<void>;
export declare const login: (req: Request<{}, {}, LoginRequest>, res: Response) => Promise<void>;
//# sourceMappingURL=authController.d.ts.map