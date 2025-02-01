const clientError = require('./ClientError');

class InvariantError extends clientError {
  constructor(messege){
    super(messege);
    this.name = 'Invariant_Error';

  }
}
module.exports = InvariantError;
