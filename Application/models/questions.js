const mongoose = require("mongoose");
const schema = mongoose.Schema;

const questionsSchema = new schema(
  {
    question: {
      type: String,
    },
    status: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("questions", questionsSchema);
