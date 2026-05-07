const express = require("express");
const { login, setPassword, signup } = require("../../controllers/auth/authController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/set-password", setPassword);

module.exports = router;

