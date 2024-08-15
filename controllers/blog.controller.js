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

exports.renderDetailPage = (req, res, next) => {
  const { id } = req.params;
  Blog.findById(id)
    .then((blog) => {
      res.render("detialPage", {
        title: "Detail Blog",
        blog,
        currentLoginUserId: req.session.userInfo
          ? req.session.userInfo._id
          : "",
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Something went worung.");
      return next(error);
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
