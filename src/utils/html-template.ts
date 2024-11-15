import path from "path";
import fs from "fs";
import { logger } from "./logger";

const FOLDER = "../templates";

export async function readHtmlTemplate(templateFileName: string) {
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

export function replaceTemplateVariables(template: string, variables: any) {
  let result = template;
  for (const key in variables) {
    const regex = new RegExp(`{{${key}}}`, "g");
    result = result.replace(regex, variables[key]);
  }
  return result;
}
