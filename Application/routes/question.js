const express = require("express");
const router = express.Router();

const { addQuestion, getQuestions } = require("../controllers/question");
const { verifyTokenMiddleware } = require("../middlewares/verifyAuth");

router.post("/addquestion", addQuestion);
router.get("/getquestion", verifyTokenMiddleware, getQuestions);

module.exports = router;
