const questionModel = require("../models/questions");
const userQuestionModel = require("../models/userquestions");

const {
  statusCode,
  returnErrorJsonResponse,
  returnJsonResponse,
} = require("../helpers/status");

const { isEmpty } = require("../helpers/validation.js");

exports.addQuestion = async (req, res) => {
  try {
    let question = req.body.question;

    if (isEmpty(question)) {
      return res
        .status(statusCode.bad)
        .json(
          returnErrorJsonResponse(
            statusCode.bad,
            "fail",
            "question field cannot be empty"
          )
        );
    }

    const questions = new questionModel({
      question: question,
    });
    const data = await questions.save();
    if (data) {
      return res
        .status(statusCode.success)
        .json(
          returnJsonResponse(
            statusCode.success,
            "success",
            `questions save`,
            data
          )
        );
    } else {
      return res
        .status(statusCode.unauthorized)
        .json(
          returnJsonResponse(
            statusCode.unauthorized,
            "fail",
            `questions not save`
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

exports.getQuestions = async (req, res) => {
  try {
    const userid = req.userDetails.userid;
    const questions = await questionModel.aggregate([
      {
        $lookup: {
          from: "answers",
          localField: "_id",
          foreignField: "questionid",
          as: "options",
        },
      },
      {
        $unwind: {
          path: "$options",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          question: 1,
          "options.option1": 1,
          "options.option2": 1,
          "options.option3": 1,
          "options.option4": 1,
          "options.correctanswer": 1,
          "options.points": 1,
        },
      },
    ]);

    let finalQuestion = [];
    await Promise.all(
      questions.map((question) => {
        finalQuestion.push({
          questionid: question._id,
          userid: userid,
          question: question.question,
          option1: question.options.option1,
          option2: question.options.option2,
          option3: question.options.option3,
          option4: question.options.option4,
          correctanswer: question.options.correctanswer,
          points: question.options.points,
        });
      })
    );

    let data;
    let msg;
    const userExist = await userQuestionModel.find({ userid: userid });
    if (Object.keys(userExist).length === 0) {
      assingedQuestions = await userQuestionModel.insertMany(finalQuestion);
      if (assingedQuestions) {
        const question = await userQuestionModel.findOne({
          userid: userid,
          status: 0,
        });
        question.correctanswer = undefined;
        data = question;
        msg = "Questions fetched successfully";
      }
    } else {
      const question = await userQuestionModel.findOne({
        userid: userid,
        status: 0,
      });
      if (question) {
        question.correctanswer = undefined;
        data = question;
        msg = "Questions fetched successfully";
      } else {
        data = [];
        msg = "No more questions";
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
