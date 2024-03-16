import { Request, Response, NextFunction } from 'express';
import ApiError from './exceptions.js';


export default function (err: Error, req: Request, res: Response, next: NextFunction) {
    console.log(err);
    if (err instanceof ApiError) {
        return res.status(err.status).json({message: err.message, errors: err.errors})
    }
    return res.status(500).json({message: 'Непредвиденная ошибка'})

};