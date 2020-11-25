const mongoose = require("mongoose");
const schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const userQuestionSchema = new schema(
  {
    userid: {
      type: ObjectId,
      ref: "users",
    },
    questionid: {
      type: ObjectId,
      ref: "questions",
    },
    question: {
      type: String,
    },
    option1: {
      type: String,
    },
    option2: {
      type: String,
    },
    option3: {
      type: String,
    },
    option4: {
      type: String,
    },
    correctanswer: {
      type: String,
    },
    points: {
      type: Number,
    },
    status: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("userquestions", userQuestionSchema);
