const Blog = require("../models/blogSchema");

exports.renderCreateBlogPage = (req, res) => {
  res.render("auth/createBlog", { title: "Create Blog" });
};

exports.createBlog = (req, res) => {
  const { title, description, imgUrl } = req.body;
  const newBlog = new Blog({
    title,
    description,
    imgUrl,
    userId: req.user._id,
  });
  newBlog
    .save()
    .then((result) => res.redirect("/"))
    .catch((err) => console.log(err));
};

exports.renderEditPage = (req, res) => {
  const { id } = req.params;
  Blog.findById(id)
    .then((blog) => res.render("edit-blog", { title: "Edit Blog", blog }))
    .catch((err) => console.log(err));
};

exports.editPage = (req, res) => {
  const { id, title, description, imgUrl } = req.body;
  Blog.findByIdAndUpdate(id, { title, description, imgUrl })
    .then((result) => res.redirect("/"))
    .catch((err) => console.log(err));
};

exports.deleteBlog = (req, res) => {
  const { id } = req.params;
  Blog.findByIdAndDelete(id)
    .then((result) => res.redirect("/"))
    .catch((err) => console.log(err));
};
