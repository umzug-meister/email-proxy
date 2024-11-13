/**
 * @typedef {object} EmailData
 * @property {string} email
 * @property {string} name
 */

/**
 * @typedef {object} Attachment
 * @property {string} content
 * @property {string} filename
 * @property {"application/pdf"} type
 * @property {"attachment"} disposition
 */

/**
 * @typedef {object} SendMailPayload
 * @property {string} to
 * @property {string} subject
 * @property {string} html
 * @property {string} bcc
 * @property {EmailData} replyTo
 * @property {EmailData} from
 * @property {Array<Attachment>} attachments
 */

const sgMail = require("@sendgrid/mail");
const logger = require("../utils/logger");

module.exports = class SendGridMailProvider {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");
  }

  /**
   * 
   * @param {SendMailPayload} email 
   * @returns 
   */
  sendMail(email) {
    return sgMail.send(email).then(
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
