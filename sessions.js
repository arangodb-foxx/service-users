/*global require, exports, applicationContext */
'use strict';
const _ = require('underscore');
const joi = require('joi');
const httperr = require('http-errors');
const Foxx = require('org/arangodb/foxx');
const request = require('org/arangodb/request');
const cfg = applicationContext.configuration;

class SessionNotFound extends Error {
  constructor(sid) {
    super();
    this.name = this.constructor.name;
    this.message = `Session with session id ${sid} not found.`;
    Error.captureStackTrace(this, this.constructor);
  }
}

const Session = Foxx.Model.extend({
  schema: {
    _key: joi.string().required(),
    uid: joi.string().allow(null).default(null),
    sessionData: joi.object().default('Empty object', Object),
    userData: joi.object().default('Empty object', Object),
    created: joi.number().integer().default('Current date', Date.now),
    lastAccess: joi.number().integer().default('Current date', Date.now),
    lastUpdate: joi.number().integer().default('Current date', Date.now)
  }
});

function createSession(sessionData) {
  const res = request.post({
    url: cfg.sessionsRoot,
    body: {sessionData: sessionData || {}},
    json: true
  });
  if (res.status >= 400) {
    throw new httperr[res.status](res.message);
  }
  return new Session(res.body);
}

function deleteSession(sid) {
  const res = request.delete({
    url: cfg.sessionsRoot + '/' + sid,
    json: true
  });
  if (res.status >= 400) {
    throw new httperr[res.status](res.message);
  }
  return null;
}

Session.fromClient = function (sid) {
  const res = request.get({
    url: cfg.sessionsRoot + '/' + sid,
    json: true
  });
  if (res.status === 404) {
    throw new SessionNotFound(sid);
  }
  if (res.status >= 400) {
    throw new httperr[res.status](res.message);
  }
  return new Session(res.body);
};

_.extend(Session.prototype, {
  forClient() {
    return this.get('_key');
  },
  save() {
    const res = request.put({
      url: cfg.sessionsRoot + '/' + sid,
      body: _.pick(this.attributes, 'sessionData'),
      json: true
    });
    if (res.status === 404) {
      throw new SessionNotFound(sid);
    }
    if (res.status >= 400) {
      throw new httperr[res.status](res.message);
    }
    this.set(res.body);
    return this;
  },
  delete() {
    deleteSession(this.get('_key'));
    return true;
  }
});

exports.create = createSession;
exports.get = Session.fromClient;
exports.delete = deleteSession;
exports.errors = {SessionNotFound};
