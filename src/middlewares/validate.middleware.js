const { validationResult } = require("express-validator");

module.exports = function validate(req, _res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  return next({
    statusCode: 422,
    message: "Validation failed",
    details: result.array().map((e) => ({
      field: e.path,
      message: e.msg,
    })),
  });
};
