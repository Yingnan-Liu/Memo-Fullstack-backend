const logger = require("./logger");

const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  //不是很懂error.name：在这种情况下，我们知道错误是由 Mongo 的无效对象 id 引起的（castError）
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
    //ValidationError: mongoDB中
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({
      error: "invalid token",
    });
  }

  logger.error(error.message);
  //把error传到下一个
  next(error);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
