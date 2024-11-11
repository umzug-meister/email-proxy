const cors = require("cors");
const express = require("express");
const rateLimit = require("express-rate-limit");
const {
  readHtmlTemplate,
  replaceTemplateVariables,
} = require("./utils/html-template");
const logger = require("./utils/logger");
const checkApiKey = require("./middleware/checkApiKey");
const jsonParser = require("./middleware/jsonParser");

const app = express();
const startTime = new Date().toISOString();

const nodeEnv = process.env.NODE_ENV;
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 100 requests per windowMs
});

const corsOptions =
  nodeEnv === "production"
    ? {
        origin: process.env.CORS_ALLOWED_ORIGIN,
        optionsSuccessStatus: 200,
      }
    : {};

app.use(cors(corsOptions));
app.use(limiter);
app.set("view engine", "ejs");
app.set("views", "./src/views");

app.get("/", (_, res) => {
  res.render("index", { nodeEnv, startTime });
});

app.post("/send-mail", checkApiKey, jsonParser, (req, res) => {
  const { to, subject, variables, templateName } = req.body;

  readHtmlTemplate(templateName)
    .then((data) => {
      const html = replaceTemplateVariables(data, variables);

      const msg = {
        to,
        subject,
        html,
        bcc: process.env.FROM_EMAIL,
        replyTo: {
          email: process.env.REPLY_TO_EMAIL || "",
          name: process.env.REPLY_TO_NAME || "",
        },
        from: {
          email: process.env.FROM_EMAIL || "",
          name: process.env.FROM_NAME || "",
        },
      };

      const mailProvider = new SendGridMailProvider();
      mailProvider
        .sendMail(msg)
        .then((message) => {
          res.status(200).send(message);
        })
        .catch((error) => {
          const message = "Failed to send email";
          logger.error({ message, error });
          res.status(500).send(message);
        });
    })
    .catch((error) => {
      const message = "Failed to read HTML template";
      logger.error({ message, error });
      res.status(500).send(message);
    });
});

const port = process.env.PORT;

logger.info(`Server is running on port: ${port}`);
app.listen(port);
