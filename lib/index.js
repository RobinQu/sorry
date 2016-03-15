'use strict';

const _ = require('lodash');

class DomainError extends Error {
  constructor(options, data) {
    if(typeof options === 'string') {
      options = {message: options};
    }
    options = _.defaults(options || {}, {
      type: 'unknown',
      message: 'Unknown exception',
      statusCode: 500
    });
    super(options.message);
    this.type = options.type;
    this.statusCode = this.status = options.statusCode;
    this.message = options.message;
    this.data = data;
  }

  static assert(assertion, message) {
    const K = this;
    if(!assertion) {
      throw new K(message);
    }
  }

  static fromException(e, message) {
    /*eslint consistent-this:0 */
    message = message || 'Error';
    const K = this;
    const ex = new K(`${message} - root cause ${e.message}`, {
      casue: e
    });
    // Error.captureStackTrace(ex, this.fromException);
    ex.stack = e.stack;
    return ex;
  }
}

class OperationalError extends DomainError {
  constructor(message, data) {
    super({
      type: 'operational',
      message: message
    }, data);
    this.isOperationalError = true;
  }
}

class SystemError extends DomainError {
  constructor(message, data) {
    super({
      type: 'system',
      message: message
    }, data);
    this.isSystemError = true;
  }
}

class ParameterError extends DomainError {
  constructor(message, data) {
    super({
      message: message,
      type: 'parameter',
      statusCode: 400
    }, data);
    this.isParameterError = true;
  }

  static assert(assertion, message, data) {
    if(!assertion) {
      throw new ParameterError(message, data);
    }
  }
}

module.exports = {
  ParameterError: ParameterError,
  SystemError: SystemError,
  OperationalError: OperationalError,
  DomainError: DomainError
};
