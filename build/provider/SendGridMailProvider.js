'use strict';
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var sgMail = require('@sendgrid/mail');
var logger = require('../utils/logger');
module.exports = /** @class */ (function () {
  function SendGridMailProvider() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
  }
  SendGridMailProvider.prototype.sendMail = function (email) {
    return sgMail.send(email).then(
      function () {
        var message = 'SendGrid: Email sent successfully';
        logger.info({ message: message });
        return Promise.resolve(message);
      },
      function (error) {
        if (typeof error === 'object') {
          throw __assign({}, error);
        }
        throw { error: error };
      },
    );
  };
  return SendGridMailProvider;
})();
