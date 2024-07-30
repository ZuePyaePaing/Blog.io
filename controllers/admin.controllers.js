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
    .then((_) => res.redirect("/"))
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
  Blog.findById(id)
    .then((blog) => {
      if (!blog) {
        return res.status(404).send("Blog post not found");
      }
      if (blog.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      blog.title = title;
      blog.imgUrl = imgUrl;
      blog.description = description;
      return blog.save();
    })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Server Error");
    });
};

exports.deleteBlog = (req, res) => {
  const { id } = req.params;
  Blog.deleteOne({ _id: id, userId: req.user._id })
    .then((_) => res.redirect("/"))
    .catch((err) => console.log(err));
};
