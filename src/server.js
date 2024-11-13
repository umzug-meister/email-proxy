// @ts-check
const cors = require("cors");
const express = require("express");
const rateLimit = require("express-rate-limit");
const logger = require("./utils/logger");
const checkApiKey = require("./middleware/checkApiKey");
const jsonParser = require("./middleware/jsonParser");

const SendGridMailProvider = require("./provider/SendGridMailProvider");
const { handleOfferEmailRequest } = require("./mailRequestHandler");

const app = express();
const startTime = new Date().toISOString();
const mailProvider = new SendGridMailProvider();

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
app.use(express.json({ limit: "50mb" }));

app.get("/", (_, res) => {
  res.render("index", { nodeEnv, startTime });
});

app.post("/send-mail", checkApiKey, jsonParser, (req, res) => {
  const { type } = req.body;

  switch (type) {
    case "offer":
      handleOfferEmailRequest(req, res, mailProvider);
      break;
    case "invoice":
      return;
    case "refusal":
      return;
    default:
      res.status(400).send(`Invalid type: ${type}`);
  }
});

const port = process.env.PORT;

logger.info(`Server is running on port: ${port}`);
app.listen(port);
