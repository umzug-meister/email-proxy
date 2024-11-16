import { logger } from './logger';

import fs from 'fs';
import path from 'path';

const FOLDER = '../templates';

type Variables = {
  [key: string]: string;
};
export async function generateHtmlEmail({
  includeAdvertisement,
  variables,
}: {
  includeAdvertisement: boolean;
  variables: Variables;
}) {
  const emailTemplate = await readHtmlTemplate('email');
  let advertisement = '';
  if (includeAdvertisement) {
    advertisement = await readHtmlTemplate('advertisement');
  }
  return replaceTemplateVariables(emailTemplate, { advertisement, ...variables });
}

async function readHtmlTemplate(templateFileName: string): Promise<string> {
  const templatePath = path.join(__dirname, FOLDER, `${templateFileName}.html`);

  logger.info({ message: `Reading template file: ${templatePath}` });

  return new Promise((resolve, reject) => {
    return fs.readFile(templatePath, 'utf8', (err, data) => {
      if (err) {
        logger.error({ error: err });
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

function replaceTemplateVariables(template: string, variables: any) {
  let result = template;
  for (const key in variables) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, variables[key]);
  }
  return result;
}
