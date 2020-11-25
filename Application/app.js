//  Importing Packages
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Importing environment variable package
require("dotenv").config();

// Object of Express
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(compression());
app.use(helmet());

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests,
});
app.use(limiter);

// Importing Routers
const userRouter = require("./routes/user");
const questionRouter = require("./routes/question");
const answerRouter = require("./routes/answer");

// Importing Routers
app.use("/v1", userRouter);
app.use("/v1", questionRouter);
app.use("/v1", answerRouter);

// 404 "URL not available"
app.use((req, res, next) => {
  res.status(404).json({
    statusCode: 404,
    status: "fail",
    message: "URL not available",
  });
});


// Importing MongoDB
const mongoDB = require("./databases/mongo");

const PORT = process.env.PORT || 3001;
mongoDB
  .mongoConnection()
  .then((result) => {
    app.listen(PORT, () => {
      console.log(`Application is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
