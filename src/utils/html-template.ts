import path from "path";

import fs from "fs";
import { logger } from "./logger.ts";

import { fileURLToPath } from "url";

const FOLDER = "../templates";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function readHtmlTemplate(
  templateFileName: string
): Promise<string> {
  const templatePath = path.join(__dirname, FOLDER, `${templateFileName}.html`);

  logger.info({ message: `Reading template file: ${templatePath}` });

  return new Promise((resolve, reject) => {
    return fs.readFile(templatePath, "utf8", (err, data) => {
      if (err) {
        logger.error({ error: err });
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

export function replaceTemplateVariables(
  template: string,
  variables: Record<string, string>
): string {
  let result = template;
  for (const key in variables) {
    const regex = new RegExp(`{{${key}}}`, "g");
    result = result.replace(regex, variables[key]);
  }
  return result;
}
