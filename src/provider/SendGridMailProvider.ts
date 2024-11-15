const sgMail = require('@sendgrid/mail');
const logger = require('../utils/logger');

export class SendGridMailProvider {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
  }

  sendMail(email: any) {
    return sgMail.send(email).then(
      () => {
        const message = 'SendGrid: Email sent successfully';
        logger.info({ message });
        return Promise.resolve(message);
      },
      (error: any) => {
        if (typeof error === 'object') {
          throw { ...error };
        }
        throw { error };
      },
    );
  }
}
