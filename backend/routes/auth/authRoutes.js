const express = require("express");
const { login, setPassword } = require("../../controllers/auth/authController");

const router = express.Router();

router.post("/login", login);
router.post("/set-password", setPassword);

module.exports = router;
