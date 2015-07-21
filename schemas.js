/*global require, exports */
'use strict';
const joi = require('joi');

exports.userId = joi.string().required()
.description('Username.');
exports.userData = joi.object()
.default(Object, 'empty object');
exports.password = joi.object().required()
.keys({password: joi.string().required()})
.description('Password.');
exports.passwordChange = joi.object().required()
.keys({
  password: joi.string().required(),
  newPassword: joi.string().required()
})
.description('Old and new password.');
