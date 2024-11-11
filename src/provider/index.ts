type EmailData = {
  email: string;
  name: string;
};

type SendMailFnPayload = {
  to: string;
  subject: string;
  html: string;
  bcc: string;
  replyTo: EmailData;
  from: EmailData;
};

type SendMailFn = (payload: SendMailFnPayload) => Promise<string>;

interface MailProvider {
  sendMail: SendMailFn;
}
