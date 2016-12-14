import StackTrace from 'stacktrace-js';

/**
 * Error handling factory
 * @description Returns methods for error handling with improved stack traces
 */
function ErrorsFactory () {
  return {
    throw: err => {
      StackTrace.fromError(err).then(stack => {
        err.stack = stack.join('\n');
        throw err;
      });      
    }
  };
}

module.exports = {
  name: 'ErrorsFactory',
  fn: ErrorsFactory
};
