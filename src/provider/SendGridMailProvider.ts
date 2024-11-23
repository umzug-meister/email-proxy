import { AppEmail } from '../types';
import { logger } from '../utils/logger';
import { MailProvider } from './MailProvider';

import sgMail, { MailDataRequired } from '@sendgrid/mail';

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

  async sendMail(email: AppEmail): Promise<string> {
    try {
      await sgMail.send(this.convertToProviderMail(email));

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

  private convertToProviderMail(email: AppEmail): MailDataRequired {
    return {
      to: email.to,
      from: email.from,
      bcc: email.bcc,
      replyTo: email.replyTo,
      subject: email.subject,
      html: email.html,
      attachments: email.attachments.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        disposition: 'attachment',
        type: 'application/pdf',
      })),
    };
  }
}
