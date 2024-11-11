const path = require('path');

const fs = require('fs');
const logger = require('./logger.js');

const FOLDER = '../templates';

async function readHtmlTemplate(templateFileName) {
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

function replaceTemplateVariables(template, variables) {
  let result = template;
  for (const key in variables) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, variables[key]);
  }
  return result;
}

module.exports = {
  replaceTemplateVariables,
  readHtmlTemplate,
};
