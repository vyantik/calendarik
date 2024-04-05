import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

interface CustomRequest extends Request {
    user?: string | JwtPayload;
  }

export default CustomRequest;