const _ = require("lodash");

const userModel = require("../models/user");
const userAnswerModel = require("../models/useranswers");
const {
  statusCode,
  returnErrorJsonResponse,
  returnJsonResponse,
} = require("../helpers/status");
const { createUserToken } = require("../helpers/generateToken");
// const { tokenVerification } = require("../middlewares/verifyAuth");
const {
  isEmailValid,
  isEmpty,
  validatePassword,
} = require("../helpers/validation.js");

exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!isEmailValid(email)) {
      return res
        .status(statusCode.bad)
        .json(
          returnErrorJsonResponse(
            statusCode.bad,
            "fail",
            "Please enter a valid Email"
          )
        );
    }

    if (!validatePassword(password)) {
      return res
        .status(statusCode.bad)
        .json(
          returnErrorJsonResponse(
            statusCode.bad,
            "fail",
            "Password must be more than 6 characters"
          )
        );
    }

    if (isEmpty(name)) {
      return res
        .status(statusCode.bad)
        .json(
          returnErrorJsonResponse(
            statusCode.bad,
            "fail",
            "name field cannot be empty"
          )
        );
    }

    const user = await userModel.findOne({ email });
    if (user) {
      return res
        .status(statusCode.bad)
        .json(
          returnErrorJsonResponse(statusCode.bad, "fail", "User already exist")
        );
    }

    const userDetails = new userModel({
      name,
      email,
      password,
    });

    const userResult = await userDetails.save();
    const data = { id: userResult._id };
    return res
      .status(statusCode.success)
      .json(
        returnJsonResponse(
          statusCode.success,
          "success",
          "User Registered Successfully",
          data
        )
      );
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

exports.userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(statusCode.unauthorized)
        .json(
          returnErrorJsonResponse(
            statusCode.bad,
            "fail",
            "User with that email does not exist. Please signup"
          )
        );
    }

    // authenticate user
    if (!user.authenticate(password)) {
      return res
        .status(statusCode.unauthorized)
        .json(
          returnErrorJsonResponse(
            statusCode.bad,
            "fail",
            "Email and password do not match"
          )
        );
    }
    // generate a token and send to client
    const token = createUserToken(
      { email: user.email, userid: user._id },
      process.env.LOGIN_SECRET_KEY,
      "1d"
    );

    user.hashedPassword = undefined;
    user.salt = undefined;

    const userData = {
      token: token,
      user: user,
    };
    return res
      .status(statusCode.success)
      .json(
        returnJsonResponse(
          statusCode.success,
          "success",
          "User successfully logged in",
          userData
        )
      );
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

exports.leaderBoard = async (req, res) => {
  try {
    // userAnswerModel.find().groupby()

    const marks = await userModel.aggregate([
      {
        $lookup: {
          from: "useranswers",
          localField: "_id",
          foreignField: "userid",
          as: "useranswers",
        },
      },
      {
        $unwind: {
          path: "$useranswers",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: { useremail: "$email", userid: "$_id" },
          marks: { $sum: "$useranswers.points" },
        },
      },
      {
        $sort: {
          marks: -1,
        },
      },
    ]);
    let result = [];
    await Promise.all(
      marks.map((values) => {
        result.push({
          userid: values._id.userid,
          useremail: values._id.useremail,
          marks: values.marks,
        });
      })
    );

    return res
      .status(statusCode.success)
      .json(
        returnJsonResponse(
          statusCode.success,
          "success",
          "User successfully logged in",
          result
        )
      );
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
