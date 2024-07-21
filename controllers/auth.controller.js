const Blog = require("../models/blogSchema");

exports.renderCreateBlogPage = (req, res) => {
  res.render("auth/createBlog", { title: "Create Blog" });
};

exports.createBlog = (req, res) => {
  const { title, imgUrl, description } = req.body;
  Blog.create({ title, imgUrl, description, userId: req.user })
    .then((blog) => {
      console.log(blog);
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.editPage = (req, res) => {
  res.render("eidtBlog", { title: "Edit Page" });
};

exports.renderRgisterPage = (req, res) => {
  res.render("auth/registerForm", { title: "Register Page!"});
};

exports.renderLoginPage = (req, res) => {
  res.render("auth/loginForm", { title: "Login Page!" });
};
