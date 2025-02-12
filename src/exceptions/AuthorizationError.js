const ClientError = require('./ClientError');
/**
 * @param {string} message
 */
class AuthorizationError extends ClientError {
  constructor(message) {
    super(message, 403); // 403 =  forbidden
    this.name = 'AuthorizationError';
  }
}

module.exports = AuthorizationError;