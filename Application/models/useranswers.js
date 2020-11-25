const mongoose = require("mongoose");
const schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const userAnswerSchema = new schema(
  {
    userid: {
      type: ObjectId,
      ref: "users",
    },
    questionid: {
      type: ObjectId,
      ref: "questions",
    },
    useranswer: {
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

module.exports = mongoose.model("useranswers", userAnswerSchema);
