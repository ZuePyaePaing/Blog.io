const express = require("express");

const router = express.Router();

const blogControllers = require("../controllers/blog.controller");

router.get("/", blogControllers.renderHomePage);

router.get('/detail/:id',blogControllers.renderDetailPage)

router.get('/edit-blog/:id', blogControllers.renderEditPage)

module.exports = router;
