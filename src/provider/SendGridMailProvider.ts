import { Email } from '../types';
import { logger } from '../utils/logger';
import { MailProvider } from './MailProvider';

import sgMail from '@sendgrid/mail';

export class SendGridMailProvider implements MailProvider {
  constructor() {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      const error = 'SENDGRID_API_KEY is not set in environment variables';
      logger.error(error);
    } else {
      sgMail.setApiKey(apiKey);
    }
  }

  async sendMail(email: Email): Promise<string> {
    try {
      await sgMail.send(email);

      const logMessage = `SendGrid: Email sent successfully`;
      logger.info({
        message: logMessage,
        subject: email.subject,
        to: email.to,
      });

      return logMessage;
    } catch (error: any) {
      if (typeof error === 'object') {
        throw { ...error };
      }
      throw { error };
    }
  }
}
