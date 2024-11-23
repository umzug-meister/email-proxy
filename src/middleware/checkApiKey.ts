import { logger } from '../utils/logger';

import { NextFunction, Request, Response } from 'express';

export function checkApiKey(req: Request, res: any, next: NextFunction) {
  const apiKey = req.headers['x-api-key'] as string;

  if (!process.env.API_KEY) {
    logger.error('API key is not configured in the environment variables');
    return res.status(500).send('Server configuration error');
  }

  if (apiKey !== process.env.API_KEY) {
    logger.warn({
      message: 'Invalid or missing API key',
      method: req.method,
      url: req.originalUrl,
    });
    return res.status(401).send('Access denied: Invalid or missing API key');
  }

  logger.info({
    message: 'API key validated successfully',
    method: req.method,
    url: req.originalUrl,
  });

  next();
}
