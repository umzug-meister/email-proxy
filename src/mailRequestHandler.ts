import { MailProvider } from './provider/MailProvider';
import { Email } from './types';
import { generateHtmlEmail } from './utils/html-template';
import { logger } from './utils/logger';

import { Request, Response } from 'express';

export async function handleRequest(req: Request, res: Response, mailProvider: MailProvider) {
  const { to, subject, variables, attachment, type } = req.body;

  if (!to || !subject || !variables) {
    const message = 'Missing "to", "subject", or "variables" in request body';
    logger.error({
      message,
    });
    return res.status(400).send(message);
  }
  if (type !== 'refusal' && !attachment) {
    const message = 'Missing "attachment" in request body';
    logger.error({
      message,
    });
    return res.status(400).send(message);
  }

  const isRefusal = type === 'refusal';
  logMailSending({ to, subject });
  generateHtmlEmail(!isRefusal, variables)
    .then((html) => {
      sendMail(res, mailProvider, {
        to,
        subject,
        html,
        bcc: process.env.FROM_EMAIL || '',
        replyTo: {
          email: process.env.REPLY_TO_EMAIL || '',
          name: process.env.REPLY_TO_NAME || '',
        },
        from: {
          email: process.env.FROM_EMAIL || '',
          name: process.env.FROM_NAME || '',
        },
        attachments: isRefusal
          ? []
          : [
              {
                content: attachment.content,
                filename: attachment.filename,
                disposition: 'attachment',
                type: 'application/pdf',
              },
            ],
      });
    })
    .catch((error) => {
      const message = 'Failed to read HTML template';
      logger.error({ message, error });
      res.status(500).send(message);
    });
}

function logMailSending({ subject, to }: { subject: string; to: string }) {
  logger.info({
    message: `Sending email with subject ${subject} to ${to.split('@')[0]}`,
  });
}

function sendMail(res: Response, mailProvider: MailProvider, email: Email) {
  mailProvider
    .sendMail(email)
    .then((message: string) => {
      res.status(200).send(message);
    })
    .catch((error: any) => {
      const message = 'Failed to send email';
      logger.error({ message, error });
      res.status(500).send(message);
    });
}
