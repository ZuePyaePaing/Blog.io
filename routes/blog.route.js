const express = require("express");

const router = express.Router();

const blogControllers = require("../controllers/blog.controller");

router.get("/", blogControllers.renderHomePage);

module.exports = router;
