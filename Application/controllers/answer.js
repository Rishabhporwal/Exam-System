const userAnswerModel = require("../models/useranswers");
const userQuestionModel = require("../models/userquestions");

const {
  statusCode,
  returnErrorJsonResponse,
  returnJsonResponse,
} = require("../helpers/status");

const { isEmpty } = require("../helpers/validation.js");

exports.submitAnswer = async (req, res) => {
  try {
    const userid = req.userDetails.userid;
    const questionid = req.body.questionid;
    const useranswer = req.body.useranswer;
    let marks;

    if (isEmpty(questionid) && isEmpty(useranswer)) {
      return res
        .status(statusCode.bad)
        .json(
          returnErrorJsonResponse(
            statusCode.bad,
            "fail",
            "field cannot be empty"
          )
        );
    }

    const getQuestion = await userQuestionModel.findOne({
      userid: userid,
      questionid: questionid,
    });
    if (getQuestion && getQuestion.correctanswer === useranswer) {
      marks = getQuestion.points;
    } else {
      marks = 0;
    }

    const questionSubmisionUpdated = await userQuestionModel.updateOne(
      { userid: userid, questionid: questionid },
      { $set: { status: 1 } }
    );

    const answers = new userAnswerModel({
      userid: userid,
      questionid: questionid,
      useranswer: useranswer,
      points: marks,
    });

    let data;
    let msg;

    const question = await userQuestionModel.findOne({
      userid: userid,
      status: 0,
    });
    const submitedAnswer = await userAnswerModel.findOne({
      userid: userid,
      questionid: questionid,
    });

    if (submitedAnswer) {
      if (question) {
        question.correctanswer = undefined;
        data = question;
        msg = "Answer already submitted, Next question fetch successfully";
      } else {
        data = [];
        msg = "Answer already submitted, No more question remaining";
      }
    } else {
      const result = await answers.save();
      if (question) {
        question.correctanswer = undefined;
        data = question;
        msg = "Next question fetched successfully";
      } else {
        data = [];
        msg = "No more questions remaining";
      }
    }

    return res
      .status(statusCode.success)
      .json(returnJsonResponse(statusCode.success, "success", msg, data));
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
