import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export default (req: Request, res: Response, next: NextFunction): void => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if(token) {
        try {
            const decoded = jwt.verify(token, 'secret123') as { id: string };

            req.body.userId = decoded.id;
            next();
        } catch (e) {
            res.status(403).json({
                message: 'Нет доступа',
            });
            return;
        }
    } else {
        res.status(403).json({
            message: 'Нет доступа',
        });
        return;
    }
};