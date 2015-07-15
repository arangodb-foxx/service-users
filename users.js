/*global applicationContext, exports */
'use strict';
const NotFound = require('http-errors').NotFound;
const users = applicationContext.dependencies.users.userStorage;

module.exports = {
  get(id) {
    try {
      return users.get(id);
    } catch (e) {
      if (e instanceof users.errors.UserNotFound) {
        throw new NotFound();
      } else throw e;
    }
  }
}