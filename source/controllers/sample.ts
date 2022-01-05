import { NextFunction, Request, Response } from 'express';
import logging from '../config/logging';

const NAMESPACE = 'Sample Controller';

const serverHealthCheck = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Sample Health Check route called');
    
    return res.status(200).json({
        message: 'pong'
    });
};

export default { serverHealthCheck };
