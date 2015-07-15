/*global require, applicationContext, module */
'use strict';
const crypto = require('org/arangodb/crypto');
const baseline = applicationContext.configuration.minPasswordIterations;

module.exports = {
  verifyPassword(authData, password) {
    if (!authData) authData = {};
    const salt = authData.salt || '';
    const rounds = authData.rounds || baseline;
    const hash = crypto.pbkdf2(salt, password, rounds, 66);
    return crypto.constantEquals(
      authData.hash || '',
      new Buffer(hash, 'hex').toString('base64')
    );
  },
  hashPassword(password) {
    const salt = crypto.genRandomSalt(66);
    const rounds = baseline + Math.floor(Math.random() * 10000);
    const hash = crypto.pbkdf2(salt, password, rounds, 66);
    return {salt: salt, rounds: rounds, hash: new Buffer(hash, 'hex').toString('base64')};
  }
};