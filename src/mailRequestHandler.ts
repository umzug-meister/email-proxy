import {
  readHtmlTemplate,
  replaceTemplateVariables,
} from "./utils/html-template";

import { logger } from "./utils/logger";

async function handleEmailRequest(res: any, mailProvider: any, email: any) {
  mailProvider
    .sendMail(email)
    .then((message: string) => {
      res.status(200).send(message);
    })
    .catch((error: any) => {
      const message = "Failed to send email";
      logger.error({ message, error });
      res.status(500).send(message);
    });
}

export async function handleOfferEmailRequest(
  req: any,
  res: any,
  mailProvider: any
) {
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
      const html = replaceTemplateVariables(template as string, variables);

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
