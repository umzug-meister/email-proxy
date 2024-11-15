"use strict";
var handleOfferEmailRequest = require("./mailRequestHandler").handleOfferEmailRequest;
var app = express();
var startTime = new Date().toISOString();
var mailProvider = new SendGridMailProvider();
var nodeEnv = process.env.NODE_ENV;
var limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // limit each IP to 100 requests per windowMs
});
var corsOptions = nodeEnv === "production"
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
app.get("/", function (_, res) {
    res.render("index", { nodeEnv: nodeEnv, startTime: startTime });
});
app.post("/send-mail", checkApiKey, jsonParser, function (req, res) {
    var type = req.body.type;
    switch (type) {
        case "offer":
            handleOfferEmailRequest(req, res, mailProvider);
            break;
        case "invoice":
            return;
        case "refusal":
            return;
        default:
            res.status(400).send("Invalid type: ".concat(type));
    }
});
var port = process.env.PORT;
logger.info("Server is running on port: ".concat(port));
app.listen(port);
