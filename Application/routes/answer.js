const express = require("express");
const router = express.Router();

const { submitAnswer } = require("../controllers/answer");
const { verifyTokenMiddleware } = require("../middlewares/verifyAuth");

router.post("/submitanswer", verifyTokenMiddleware, submitAnswer);

module.exports = router;
