const mongoose = require("mongoose");

const {
  statusCode,
  returnErrorJsonResponse,
  returnJsonResponse,
} = require("../helpers/status");

require("dotenv").config();

exports.mongoConnection = async () => {
  var DBURL = process.env.DATABASEURL;

  try {
    await mongoose.connect(DBURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
  } catch (error) {
    return returnErrorJsonResponse(
      statusCode.bad,
      "fail",
      "Something went wrong, Please try again",
      error
    );
  }
};
