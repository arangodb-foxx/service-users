# ArangoDB User-Service

## Configuration

* **sessionsRoot**: *string* (Default: `"/sessions"`)

  The base URL of the remote REST API that stores the sessions.

* **minPasswordIterations**: *integer* (Default: `100000`)

  Minimum number of iterations when hashing passwords with PBKDF2.

## Dependencies

* **users**: `users-local:^2.0.0`

  User storage that stores and manages user accounts.

## HTTP API

### GET /:username

Requires a valid session header for a session authenticated to the username.

Fetches the user from the database. Returns the user's user data.

### PUT /:username

Requires a valid session header for a session authenticated to the username.

Updates the user's user data with the data in the request body. The request body must be an object. Returns the updated user data.

### DELETE /:username

Requires a valid session header for a session authenticated to the username.

Destroys the user and removes it from the database if it exists, then logs the user out of their session. Returns an empty response.

### PUT /:username/authenticate

Verifies the given password for the user and returns the user's user data on success. The request body must be an object with a single string property `password`.

### PUT /:username/change-password

Requires a valid session header for a session authenticated to the username.

Replaces the user's password. The request body must be an object with two string properties `old` and `new`. The value of `old` must be the user's current password, the value of `new` will be used as the user's new password.

## License

This code is distributed under the [Apache License](http://www.apache.org/licenses/LICENSE-2.0).
