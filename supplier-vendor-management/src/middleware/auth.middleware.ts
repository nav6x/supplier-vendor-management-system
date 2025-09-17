import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header');
    }

    const token = authHeader.substring(7);
    const secret = process.env.JWT_SECRET || 'secretKey';
    
    try {
      const decoded = jwt.verify(token, secret);
      req['user'] = decoded;
      next();
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}