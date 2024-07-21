const express = require("express");
const authControllers = require("../controllers/auth.controller");

const router = express.Router();

router.get("/edit", authControllers.editPage);

router.get("/register", authControllers.renderRgisterPage);

router.get("/login", authControllers.renderLoginPage);

router.get("/create-blog", authControllers.renderCreateBlogPage);

router.post("/create-blog", authControllers.createBlog);

module.exports = router;
