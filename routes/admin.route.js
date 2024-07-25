const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controllers"); // Ensure the correct path


router.get("/create-blog", adminController.renderCreateBlogPage);

router.post("/create-blog", adminController.createBlog);

router.get("/edit", adminController.renderEditPage);

router.post("/edit", adminController.editPage);

router.post("/delete/:id", adminController.deleteBlog);

module.exports = router;
