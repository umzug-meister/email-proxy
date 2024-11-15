export interface Email {
  to: string;
  subject: string;
  html: string;
  bcc: string;
  replyTo: EmailData;
  from: EmailData;
  attachments: Attachment[];
}

export interface MailProvider {
  sendMail: (email: Email) => Promise<string>;
}

interface Attachment {
  filename: string;
  content: string;
  disposition: 'attachment';
  type: 'application/pdf';
}

interface EmailData {
  email: string;
  name: string;
}
