import sgMail from "@sendgrid/mail";
import { logger } from "../utils/logger.ts";

export class SendGridMailProvider implements MailProvider {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");
  }

  public sendMail(payload: SendMailFnPayload) {
    return sgMail.send(payload).then(
      () => {
        const message = "SendGrid: Email sent successfully";
        logger.info({ message });
        return Promise.resolve(message);
      },
      (error) => {
        if (typeof error === "object") {
          throw { ...error };
        }
        throw { error };
      }
    );
  }
}
