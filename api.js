/*global require, applicationContext */
'use strict';
const Unauthorized = require('http-errors').Unauthorized;
const Foxx = require('org/arangodb/foxx');
const users = require('./users');
const ctrl = new Foxx.Controller(applicationContext);

ctrl.activateSessions({
  sessionStorage: applicationContext.dependencies.sessions.sessionStorage,
  header: true
});

ctrl.get('/:userId', function (req, res) {
  const userId = req.params('userId');
  if (!req.session || req.session.get('uid') !== userId) {
    throw new Unauthorized();
  }
  const user = users.get(userId);
  res.status(200);
  res.json(user.get('userData'));
})
.pathParam('userId', schemas.userId);

ctrl.put('/:userId', function (req, res) {
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

ctrl.delete('/:userId', function (req, res) {
  const userId = req.params('userId');
  if (!req.session || req.session.get('uid') !== userId) {
    throw new Unauthorized();
  }
  const user = users.get(userId);
  user.delete();
  res.status(204);
})
.pathParam('userId', schemas.userId);

ctrl.put('/:userId/authenticate', function (req, res) {
  const userId = req.params('userId');
  const user = user.get(userId);
  ...
  res.status(200);
  res.json(user.get('userData'));
})
.bodyParam('password', schemas.password)
.pathParam('userId', schemas.userId);

ctrl.put('/:userId/change-password', function (req, res) {
  const userId = req.params('userId');
  if (!req.session || req.session.get('uid') !== userId) {
    throw new Unauthorized();
  }
  const user = users.get(userId);
  ...
  res.status(204);
})
.bodyParam('passwords', schemas.passwordChange)
.pathParam('userId', schemas.userId);
