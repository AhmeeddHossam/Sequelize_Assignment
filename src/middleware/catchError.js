// wraps every async controller so we don't repeat try / catch
const catchError = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => next(error));
  };
};

module.exports = catchError;
