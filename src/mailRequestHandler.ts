import { MailProvider } from './provider/MailProvider';
import { AppAttachment, AppEmail, AppRequest, SendEmailRequest } from './types';
import { generateHtmlEmail } from './utils/html-template';
import { logger } from './utils/logger';

import { Response } from 'express';

export async function handleRequest(req: AppRequest, res: Response, mailProvider: MailProvider) {
  try {
    const { to, subject, variables, attachments, type } = req.body;

    // Validate request body
    validateRequestBody(req.body);

    logMailSending({ to, subject });

    const html = await generateHtmlEmail({
      includeAdvertisement: type === 'offer',
      variables,
    });

    const email: AppEmail = enreachEmail({
      to,
      subject,
      html,
      attachments,
    });

    const result = await mailProvider.sendMail(email);
    res.status(200).send(result);
  } catch (error: any) {
    handleError(error, res);
  }
}

function validateRequestBody({
  to,
  subject,
  variables,
  attachments,
  type,
}: Partial<SendEmailRequest>): void {
  if (!to || !subject || !variables) {
    throw new Error('Missing "to", "subject", or "variables" in request body');
  }
  if (type !== 'rejection' && !Array.isArray(attachments)) {
    throw new Error('Missing "attachment as array" in request body for non-rejection types');
  }
}

function logMailSending({ subject, to }: { subject: string; to: string }) {
  logger.info({
    message: `Sending email with subject "${subject}" to "${to}"`,
  });
}

function enreachEmail({
  to,
  subject,
  html,
  attachments,
}: {
  to: string;
  subject: string;
  html: string;
  attachments: AppAttachment[];
}): AppEmail {
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
    attachments,
  };
}

function handleError(error: Error, res: Response): void {
  logger.error({ message: error.message, stack: error.stack });

  const errorMessage = error.message;
  let statusCode = 500;

  if (typeof errorMessage === 'string' && errorMessage.includes('Missing')) {
    statusCode = 400;
  }

  res.status(statusCode).send(error.message);
}
