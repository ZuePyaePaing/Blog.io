const express = require("express");
const authControllers = require("../controllers/auth.controller");

const router = express.Router();

router.get("/register", authControllers.renderRegisterPage);

router.post("/register", authControllers.createAccount);

router.get("/login", authControllers.renderLoginPage);

router.post("/login", authControllers.accountLogin);

router.post("/logout", authControllers.accountLogout);

router.get("/reset-password", authControllers.renderResetPassword);

router.post("/reset-password", authControllers.resetLink);

router.get("/reset-password/:token", authControllers.renderChangeNewPassword);

router.post("/change-password", authControllers.changeNewPassword);
module.exports = router;
