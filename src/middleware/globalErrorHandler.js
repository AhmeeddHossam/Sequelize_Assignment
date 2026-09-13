// handles the validation errors and any other error in one place
const globalErrorHandler = (error, req, res, next) => {
  if (
    error.name === "SequelizeValidationError" ||
    error.name === "SequelizeUniqueConstraintError"
  ) {
    return res.status(400).json({
      message: "Validation error",
      errors: error.errors.map((err) => err.message),
    });
  }

  if (error.name === "SequelizeForeignKeyConstraintError") {
    return res.status(400).json({
      message: "Invalid foreign key, the related row does not exist",
    });
  }

  const statusCode = error.statusCode || 500;
  return res.status(statusCode).json({ message: error.message });
};

module.exports = globalErrorHandler;
