const jwt = require("jsonwebtoken");

const {
  statusCode,
  returnErrorJsonResponse,
  returnJsonResponse,
} = require("../helpers/status.js");

exports.verifyTokenMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res
      .status(statusCode.unauthorized)
      .json(
        returnJsonResponse(
          statusCode.unauthorized,
          "fail",
          "Unauthorized request, Try again.",
          []
        )
      );
  }

  try {
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.LOGIN_SECRET_KEY);

    if (decoded) {
      req.userDetails = decoded;
      next();
    } else {
      return res
        .status(statusCode.unauthorized)
        .json(
          returnJsonResponse(
            statusCode.unauthorized,
            "fail",
            "Unauthorized token, Use correct Token.",
            []
          )
        );
    }
  } catch (error) {
    return res
      .status(statusCode.bad)
      .json(
        returnErrorJsonResponse(
          statusCode.bad,
          "fail",
          "Something went wrong, Please try again",
          error
        )
      );
  }
};
