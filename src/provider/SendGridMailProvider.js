import logger from "../utils/logger";

const sgMail = require("@sendgrid/mail");

module.exports = class SendGridMailProvider {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");
  }

  sendMail(payload) {
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
      },
    );
  }
};
