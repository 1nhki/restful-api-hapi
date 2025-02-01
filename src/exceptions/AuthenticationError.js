const ClientError = require('./ClientError')
/**
 * @param {string} message 
 */
class AuthenticationError extends ClientError {
    constructor(message) {
      super(message, 401); // 401 = unauthorized
      this.name = 'AuthenticationError';
    }
  }
   
module.exports = AuthenticationError;