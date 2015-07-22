/*global require, applicationContext */
'use strict';
const Unauthorized = require('http-errors').Unauthorized;
const Foxx = require('org/arangodb/foxx');
const users = require('./users');
const schemas = require('./schemas');
const util = require('./util');
const sessions = require('./sessions');
const authedApi = new Foxx.Controller(applicationContext);
const publicApi = new Foxx.Controller(applicationContext);

publicApi.put('/:userId/authenticate', function (req, res) {
  const user = users.get(req.params('userId'));
  const password = req.params('password').password;
  const valid = util.verifyPassword(user.get('authData'), password);
  if (!valid) {
    throw new Unauthorized();
  }
  res.status(200);
  res.json(user.get('userData'));
})
.bodyParam('password', schemas.password)
.pathParam('userId', schemas.userId);

authedApi.activateSessions({
  sessionStorage: sessions,
  header: true,
  param: true
});

authedApi.get('/:userId', function (req, res) {
  const userId = req.params('userId');
  if (!req.session || req.session.get('uid') !== userId) {
    throw new Unauthorized();
  }
  const user = users.get(userId);
  res.status(200);
  res.json(user.get('userData'));
})
.pathParam('userId', schemas.userId);

authedApi.put('/:userId', function (req, res) {
  const userId = req.params('userId');
  if (!req.session || req.session.get('uid') !== userId) {
    throw new Unauthorized();
  }
  const user = users.get(userId);
  user.set('userData', req.params('userData'));
  user.save();
  res.status(200);
  res.json(user.get('userData'));
})
.bodyParam('userData', schemas.userData)
.pathParam('userId', schemas.userId);

authedApi.delete('/:userId', function (req, res) {
  const userId = req.params('userId');
  if (!req.session || req.session.get('uid') !== userId) {
    throw new Unauthorized();
  }
  const user = users.get(userId);
  user.delete();
  req.session.delete();
  res.status(204);
})
.pathParam('userId', schemas.userId);

authedApi.put('/:userId/change-password', function (req, res) {
  const userId = req.params('userId');
  if (!req.session || req.session.get('uid') !== userId) {
    throw new Unauthorized();
  }
  const user = users.get(userId);
  const passwords = req.params('passwords');
  const authData = user.get('authData');
  if (authData && Object.keys(authData).length) {
    // Allow setting a password if user has no password, yet
    const valid = util.verifyPassword(authData, passwords.password);
    if (!valid) {
      throw new Unauthorized();
    }
  }
  user.set('authData', util.hashPassword(passwords.newPassword));
  user.save();
  res.status(204);
})
.bodyParam('passwords', schemas.passwordChange)
.pathParam('userId', schemas.userId);
