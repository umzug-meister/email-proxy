import { Request } from 'express';

export type AppEmail = {
  to: string;
  subject: string;
  html: string;
  bcc: string;
  replyTo: EmailData;
  from: EmailData;
  attachments: AppAttachment[];
};

type SgAttachment = {
  filename: string;
  content: string;
  disposition: 'attachment';
  type: 'application/pdf';
};

type EmailData = {
  email: string;
  name: string;
};

type AppRequest = Request<{}, {}, SendEmailRequest>;

type AppAttachment = {
  filename: string;
  content: string;
};

export type SendEmailRequest = {
  type: 'offer' | 'invoice' | 'rejection';
  to: string;
  subject: string;
  variables: {
    [key: string]: string;
  };
  attachments: AppAttachment[];
};
