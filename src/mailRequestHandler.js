// @ts-check
const SendGridMailProvider = require("./provider/SendGridMailProvider");
const {
  readHtmlTemplate,
  replaceTemplateVariables,
} = require("./utils/html-template");
const logger = require("./utils/logger");

/**
 *
 * @param {*} res
 * @param {*} mailProvider
 * @param {import("./provider/SendGridMailProvider").SendMailPayload} email
 */
async function handleEmailRequest(res, mailProvider, email) {
  mailProvider
    .sendMail(email)
    .then((message) => {
      res.status(200).send(message);
    })
    .catch((error) => {
      const message = "Failed to send email";
      logger.error({ message, error });
      res.status(500).send(message);
    });
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {SendGridMailProvider} mailProvider
 */
async function handleOfferEmailRequest(req, res, mailProvider) {
  const { to, subject, variables, attachment } = req.body;

  if (!to || !subject || !variables || !attachment) {
    const message = 'Missing "to", "subject", or "htmlContent" in request body';
    logger.error({
      message,
    });
    return res.status(400).send(message);
  }

  readHtmlTemplate("email")
    .then((template) => {
      const html = replaceTemplateVariables(template, variables);

      handleEmailRequest(res, mailProvider, {
        to,
        subject,
        html,
        bcc: process.env.FROM_EMAIL,
        replyTo: {
          email: process.env.REPLY_TO_EMAIL,
          name: process.env.REPLY_TO_NAME,
        },
        from: {
          email: process.env.FROM_EMAIL,
          name: process.env.FROM_NAME,
        },
        attachments: [
          {
            content: attachment.content,
            filename: attachment.filename,
            disposition: "attachment",
            type: "application/pdf",
          },
        ],
      });
    })
    .catch((error) => {
      const message = "Failed to read HTML template";
      logger.error({ message, error });
      res.status(500).send(message);
    });
}

module.exports = { handleOfferEmailRequest };
