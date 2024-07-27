const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
require("dotenv").config();

//Config nodemailer
const transpoter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_MAIL,
    pass: process.env.MAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Handle Register
exports.createAccount = (req, res) => {
  const { username, email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        req.flash("error", "Email is already defined.");
        return res.redirect("/auth/register");
      }
      return bcrypt
        .hash(password, 10)
        .then((hasPassword) => {
          return User.create({ username, email, password: hasPassword });
        })
        .then((_) => {
          res.redirect("/auth/login");
          transpoter.sendMail({
            from: process.env.SENDER_MAIL,
            to: email,
            subject: "Register Successful in Blog.io.",
            html: "<p>Register Successful in Blog.i0. Created account in whit this emial.</P>",
          });
        });
    })
    .catch((err) => console.log(err));
};

//Render Register Page
exports.renderRegisterPage = (req, res) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/registerForm", {
    title: "Register Page!",
    errorMsg: message,
  });
};

// Handle Login
exports.accountLogin = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).then((user) => {
    if (!user) {
      req.flash("error", "Invalid email or password. Please try again.");
      return res.redirect("/auth/login");
    }
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        req.session.isLogin = true;
        req.session.userInfo = user;
        return req.session.save((err) => {
          if (err) {
            console.log(err);
          }

          res.redirect("/");
        });
      }

      res.redirect("/auth/login");
    });
  });
};

// Render Login Page
exports.renderLoginPage = (req, res) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/loginForm", {
    title: "Login Page!",
    errorMsg: message,
  });
};

exports.accountLogout = (req, res) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
};
