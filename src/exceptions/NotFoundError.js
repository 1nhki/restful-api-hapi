const clientError = require('./ClientError');

class NotFoundError extends clientError {
  constructor(messege){
    super(messege, 404);
    this.name = 'NotFoundError';

  }
}
module.exports = NotFoundError;

