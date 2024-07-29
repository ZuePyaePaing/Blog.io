const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
require("dotenv").config();
const crypto = require("crypto");
const { title } = require("process");

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

//Render reset-password page

exports.renderResetPassword = (req, res) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/resetPassword", {
    title: "Reset Password",
    errorMsg: message,
  });
};

// Handle Rest Password send link

exports.resetLink = (req, res) => {
  const { email } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        req.flash("error", "This email dose not have an account.");
        return res.redirect("/auth/reset-password");
      }
      const token = crypto.randomBytes(32).toString("hex");
      user.token = token;
      user.expiration = Date.now() + 180000;
      return user.save().then((_) => {
        res.render("auth/feekback", { title: "Password Reset" });
        transpoter.sendMail({
          from: process.env.SENDER_MAIL,
          to: email,
          subject: "Password Reset",
          html: `<a href='http://localhost:8080/auth/reset-password/${token}'>Click the link.</a>`,
        });
      });
    })
    .catch((err) => console.log(err));
};

// render Change new password
exports.renderChangeNewPassword = (req, res) => {
  const { token } = req.params;
  User.findOne({ token, expiration: { $gt: Date.now() } })
    .then((user) => {
      let message = req.flash(
        "error",
        "Password reset token is invalid or has expired."
      );
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      
      res.render("auth/changeNewPassword", {
        title: "Reset password",
        errorMsg: message,
        resetToken: token,
        userId: user._id,
      });
    })
    .catch((err) => console.log(err));
};

//handle Change new password
exports.changeNewPassword = (req, res) => {
  const { password, confirm_password, token, userId } = req.body;

  if (password !== confirm_password) {
    req.flash("error", "Passwords do not match.");
    return res.redirect(`/auth/change-password/${token}`);
  }

  User.findOne({
    token,
    expiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      if (!user) {
        req.flash("error", "Password reset token is invalid or has expired.");
        return res.redirect("/auth/reset-password");
      }
      return bcrypt.hash(password, 10).then((hashedPassword) => {
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        return user.save();
      });
    })
    .then(() => {
      req.flash("success", "Your password has been successfully changed.");
      res.redirect("/auth/login");
    })
    .catch((err) => {
      console.error("Error during password reset:", err); 
    });
};
