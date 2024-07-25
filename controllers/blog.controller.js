const Blog = require("../models/blogSchema");

exports.renderHomePage = (req, res) => {
  Blog.find()
    .populate("userId")
    .sort({ title: -1 })
    .then((blogs) => {
      res.render("homePage", { title: "Blog.io", blogs });
    })
    .catch((err) => console.log(err));
};

exports.renderDetailPage = (req, res) => {
  const { id } = req.params;
  Blog.findById(id)
    .then((blog) => {
      res.render("detialPage", { title: "Detail Blog", blog });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.renderEditPage = (req, res) => {
  const { id } = req.params;
  Blog.findById(id)
    .then((blog) => {
      res.render("editBlog", { title: "Edit Page", blog });
    })
    .catch((err) => console.log(err));
};
