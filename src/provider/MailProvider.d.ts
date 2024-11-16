import { Email } from '../types';

export interface MailProvider {
  sendMail: (email: Email) => Promise<string>;
}
