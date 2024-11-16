import { handleRequest } from './mailRequestHandler';
import { checkApiKey } from './middleware/checkApiKey';
import { jsonParser } from './middleware/jsonParser';
import { SendGridMailProvider } from './provider/SendGridMailProvider';
import { SendOfferEmailRequest } from './types';
import { logger } from './utils/logger';

import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import rateLimit from 'express-rate-limit';

const app = express();
const startTime = new Date().toISOString();

const mailProvider = new SendGridMailProvider();

const nodeEnv = process.env.NODE_ENV;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 100 requests per windowMs
});

const corsOptions =
  nodeEnv === 'production'
    ? {
        origin: process.env.CORS_ALLOWED_ORIGIN,
        optionsSuccessStatus: 200,
      }
    : {};

app.use(cors(corsOptions));
app.use(limiter);
app.set('view engine', 'ejs');
app.set('views', './src/views');
app.use(express.json({ limit: '50mb' }));

app.get('/', (_, res) => {
  res.render('index', { nodeEnv, startTime });
});

app.post('/send-mail', checkApiKey, jsonParser, (req: express.Request<any, any, SendOfferEmailRequest>, res) => {
  handleRequest(req, res, mailProvider);
});

const port = process.env.PORT;

logger.info(`Server is running on port: ${port}`);
app.listen(port);
