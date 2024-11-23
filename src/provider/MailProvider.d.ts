import { AppEmail } from '../types';

export interface MailProvider {
  sendMail: (email: AppEmail) => Promise<string>;
}
