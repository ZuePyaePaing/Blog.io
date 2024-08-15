const express = require("express");
const authControllers = require("../controllers/auth.controller");
const { body } = require("express-validator");
const User = require("../models/userSchema");
const router = express.Router();

//render register
router.get("/register", authControllers.renderRegisterPage);

//handle register
router.post(
  "/register",
  body("email")
    .isEmail()
    .withMessage("Please enter an valid email.")
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject(
            "Email is already exits.Please use another One."
          );
        }
      });
    }),
  body("password")
    .isLength({ min: 4 })
    .trim()
    .withMessage("Password must have 4 characters."),
  authControllers.createAccount
);

// render login
router.get("/login", authControllers.renderLoginPage);

// handle login
router.post(
  "/login",
  body("email").isEmail().withMessage("Please enter an vaild email."),
  body("password")
    .trim()
    .isLength({ min: 4 })
    .withMessage("Password must have 4 characters."),
  authControllers.accountLogin
);

// handle logout
router.post("/logout", authControllers.accountLogout);

// render reset-password
router.get("/reset-password", authControllers.renderResetPassword);

//handle reset-password
router.post(
  "/reset-password",
  body("email").isEmail().withMessage("Please enter an vaild email."),
  authControllers.resetLink
);

// render reset-password token
router.get("/reset-password/:token", authControllers.renderChangeNewPassword);

//handle change-password
router.post(
  "/change-password",
  body("password")
    .isLength({ min: 4 })
    .trim()
    .withMessage("Password must have 4 characters."),
  authControllers.changeNewPassword
);

module.exports = router;
