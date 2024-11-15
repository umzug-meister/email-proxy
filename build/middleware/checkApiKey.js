"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkApiKey = checkApiKey;
var logger_1 = __importDefault(require("../utils/logger"));
function checkApiKey(req, res, next) {
    var apiKey = req.headers["x-api-key"];
    if (!apiKey) {
        logger_1.default.error({ error: "No API key provided" });
        return res.status(401).send("Access denied: No API key provided");
    }
    if (apiKey === process.env.API_KEY) {
        next(); // API key is valid, proceed to the next middleware or route handler
    }
    else {
        logger_1.default.error({ error: "Invalid API key" });
        return res.status(403).send("Access denied: Invalid API key");
    }
}
