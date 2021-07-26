const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
//导入后端路由
const notesRouter = require("./controllers/notes");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
//导入中间件
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
//导入mongoose api
const mongoose = require("mongoose");

logger.info("connecting to", config.MONGODB_URI);

//连接mongoDB
mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(middleware.requestLogger);

//使用 express.Router 类来创建可安装的模块化路由处理程序。Router 实例是完整的中间件和路由系统；因此，常常将其称为“微型应用程序”。
// 以下示例将路由器创建为模块，在其中装入中间件，定义一些路由，然后安装在主应用程序的路径中。
app.use("/api/notes", notesRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

//在没有路由处理 HTTP 请求的情况下被调用。
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
