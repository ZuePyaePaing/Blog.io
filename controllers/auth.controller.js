const User = require("../models/userSchema");
const bcrypt = require("bcrypt");

// Handle Login
exports.createAccount = (req, res) => {
  const { username, email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        return res.redirect("/auth/register");
      }
      return bcrypt
        .hash(password, 10)
        .then((hasPassword) => {
          return User.create({ username, email, password: hasPassword });
        })
        .then((_) => res.redirect("/auth/login"));
    })
    .catch((err) => console.log(err));
};

//Render Register Page
exports.renderRegisterPage = (req, res) => {
  res.render("auth/registerForm", { title: "Register Page!" });
};

// Handle Login
exports.accountLogin = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).then((user) => {
    if (!user) {
      res.redirect("/auth/login");
    }
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        req.session.userInfo = user;
        req.session.isLogin = true;
        return req.session.save((err) => {
          res.redirect("/");
        });
      }
      res.redirect("/auth/login");
    });
  });
};

// Render Login Page
exports.renderLoginPage = (req, res) => {
  res.render("auth/loginForm", { title: "Login Page!" });
};
