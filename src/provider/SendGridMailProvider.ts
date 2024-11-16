import { Email } from '../types';
import { logger } from '../utils/logger';
import { MailProvider } from './MailProvider';

import sgMail from '@sendgrid/mail';

export class SendGridMailProvider implements MailProvider {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
  }

  sendMail(email: Email) {
    return sgMail.send(email).then(
      () => {
        const message = 'SendGrid: Email sent successfully';
        logger.info({ message });
        return Promise.resolve(message);
      },
      (error: any) => {
        if (typeof error === 'object') {
          throw { ...error };
        }
        throw { error };
      },
    );
  }
}
