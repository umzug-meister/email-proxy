import { AppEmail } from '../types';
import { logger } from '../utils/logger';
import { MailProvider } from './MailProvider';

import Mailjet, { Message } from 'node-mailjet';

export class MailJetMailProvider implements MailProvider {
  private mailJet: Mailjet;

  constructor() {
    this.mailJet = new Mailjet({
      apiKey: process.env.MAILJET_API_KEY || '',
      apiSecret: process.env.MAILJET_SECRET_KEY || '',
    });
  }

  async sendMail(email: AppEmail): Promise<string> {
    const request = this.mailJet
      .post('send', { version: 'v3.1' })
      .request(this.convertToProviderMail(email));

    return request
      .then(() => {
        const logMessage = `MailJet: Email sent successfully`;
        logger.info({
          message: logMessage,
          subject: email.subject,
          to: email.to,
        });
        return logMessage;
      })
      .catch((error) => {
        if (typeof error === 'object') {
          throw { ...error };
        }
        throw { error };
      });
  }

  public getName(): string {
    return 'MailJet';
  }

  private convertToProviderMail(email: AppEmail) {
    return {
      Messages: [
        {
          From: {
            Email: email.from.email,
            Name: email.from.name,
          },
          Bcc: [
            {
              Email: email.bcc,
            },
          ],
          To: [
            {
              Email: email.to,
              Name: email.to,
            },
          ],
          Subject: email.subject,
          HTMLPart: email.html,
          Attachments: email.attachments.map((attachment) => ({
            ContentType: 'text/plain',
            Filename: attachment.filename,
            Base64Content: attachment.content,
          })),
        },
      ],
    };
  }
}
