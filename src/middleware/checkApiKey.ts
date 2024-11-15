import { logger } from "../utils/logger";

export function checkApiKey(req: any, res: any, next: any) {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    logger.error({ error: "No API key provided" });
    return res.status(401).send("Access denied: No API key provided");
  }

  if (apiKey === process.env.API_KEY) {
    next(); // API key is valid, proceed to the next middleware or route handler
  } else {
    logger.error({ error: "Invalid API key" });
    return res.status(403).send("Access denied: Invalid API key");
  }
}
