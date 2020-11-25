const express = require("express");
const router = express.Router();

const { createUser, userLogin,leaderBoard } = require("../controllers/user");
const { verifyTokenMiddleware } = require("../middlewares/verifyAuth");

router.post("/registration", createUser);
router.post("/login", userLogin);
router.get("/leadersboard", verifyTokenMiddleware, leaderBoard);

module.exports = router;
