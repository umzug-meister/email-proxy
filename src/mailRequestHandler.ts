import { MailProvider } from './provider/MailProvider';
import { Email } from './types';
import { generateHtmlEmail } from './utils/html-template';
import { logger } from './utils/logger';

import { Request, Response } from 'express';

interface EmailRequest {
  to: string;
  subject: string;
  variables: Record<string, string>;
  attachment?: { content: string; filename: string };
  type: 'rejection' | 'invoice' | 'offer';
}

export async function handleRequest(req: Request, res: Response, mailProvider: MailProvider) {
  try {
    const { to, subject, variables, attachment, type }: EmailRequest = req.body;

    // Validate request body
    validateRequestBody({ to, subject, variables, attachment, type });

    const isRejection = type === 'rejection';
    logMailSending({ to, subject });

    const html = await generateHtmlEmail(!isRejection, variables);

    const emailOptions: Email = prepareEmailOptions({
      to,
      subject,
      html,
      isRejection,
      attachment,
    });

    const result = await mailProvider.sendMail(emailOptions);
    res.status(200).send(result);
  } catch (error: any) {
    handleError(error, res);
  }
}

function validateRequestBody({
  to,
  subject,
  variables,
  attachment,
  type,
}: Partial<EmailRequest>): void {
  if (!to || !subject || !variables) {
    throw new Error('Missing "to", "subject", or "variables" in request body');
  }
  if (type !== 'rejection' && !attachment) {
    throw new Error('Missing "attachment" in request body for non-refusal types');
  }
}

function logMailSending({ subject, to }: { subject: string; to: string }) {
  logger.info({
    message: `Sending email with subject "${subject}" to "${to}"`,
  });
}

function prepareEmailOptions({
  to,
  subject,
  html,
  isRejection,
  attachment,
}: {
  to: string;
  subject: string;
  html: string;
  isRejection: boolean;
  attachment?: { content: string; filename: string };
}): Email {
  return {
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
    attachments: isRejection
      ? []
      : [
          {
            content: attachment?.content || '',
            filename: attachment?.filename || '',
            disposition: 'attachment',
            type: 'application/pdf',
          },
        ],
  };
}

function handleError(error: Error, res: Response): void {
  logger.error({ message: error.message, stack: error.stack });
  const statusCode = error.message.includes('Missing') ? 400 : 500;
  res.status(statusCode).send(error.message);
}
