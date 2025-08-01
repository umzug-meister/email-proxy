import { handleRequest } from './mailRequestHandler';
import { checkApiKey } from './middleware/checkApiKey';
import { jsonParser } from './middleware/jsonParser';
import { MailJetMailProvider } from './provider/MailJetMailProvider';
import { SendGridMailProvider } from './provider/SendGridMailProvider';
import { SendEmailRequest } from './types';
import { logger } from './utils/logger';

import cors from 'cors';
import 'dotenv/config';
import express, { Request } from 'express';
import rateLimit from 'express-rate-limit';

const appStartTime = new Date().toString();
const app = express();

// Configuration
const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 3000;
const CORS_ALLOWED_ORIGIN = process.env.CORS_ALLOWED_ORIGIN || '*';
const REQUEST_LIMIT = parseInt(process.env.REQUEST_LIMIT || '10', 10);
const REQUEST_WINDOW = parseInt(process.env.REQUEST_WINDOW || '15', 10) * 60 * 1000;
const JSON_LIMIT = process.env.JSON_LIMIT || '50mb';

if (!process.env.CORS_ALLOWED_ORIGIN && NODE_ENV === 'production') {
  logger.warn('CORS_ALLOWED_ORIGIN is not set for production. Defaulting to "*".');
}

// Middleware
app
  .use(express.static('public'))
  .use(
    cors({
      origin: NODE_ENV === 'production' ? CORS_ALLOWED_ORIGIN : '*',
      optionsSuccessStatus: 200,
    }),
  )
  .use(
    rateLimit({
      validate: { xForwardedForHeader: false },
      windowMs: REQUEST_WINDOW, // 15 minutes
      max: REQUEST_LIMIT, // Limit each IP
      message: 'Too many requests from this IP. Please try again later.',
      handler: (req, res) => {
        logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).send('Too many requests. Please try again later.');
      },
    }),
  );

app.use(express.json({ limit: JSON_LIMIT }));

// Email Provider
// const mailProvider = new SendGridMailProvider();
const mailProvider = new MailJetMailProvider();

logger.info({
  message: `Using mail provider: ${mailProvider.getName()}`,
});

// Views
app.set('view engine', 'ejs');
app.set('views', './src/views');

// Routes
app.get('/', (_, res) => {
  res.render('index', {
    nodeEnv: NODE_ENV,
    startTime: appStartTime,
    tenant: process.env.FROM_NAME,
  });
});

// prettier-ignore
app.post('/send-mail',
  checkApiKey,
  jsonParser,
  (req: Request<{}, {}, SendEmailRequest>, res) => handleRequest(req, res, mailProvider),
);

// Fallback Route
app.use((req, res) => {
  logger.warn(`Unhandled route: ${req.method} ${req.url}`);
  res.status(404).send('Route not found');
});

app.listen(PORT, () => {
  logger.info(`Server running in ${NODE_ENV} mode on port: ${PORT}`);
});
