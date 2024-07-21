const Blog = require("../models/blogSchema");

exports.renderHomePage = (req, res) => {
  Blog.find()
    .then((blogs) => {
      res.render("homePage", { title: "Blog.io", blogs });
    })
    .catch((err) => console.log(err));
};
