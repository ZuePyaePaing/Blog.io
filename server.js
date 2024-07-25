const express = require("express");
const path = require("path");
const dotenv = require("dotenv").config();
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const mongodbStore = require("connect-mongodb-session")(session);
const User = require("./models/userSchema");

const app = express();
const port = process.env.PORT || 8000;

//Body parser middleware

app.use(bodyparser.urlencoded({ extended: false }));

// connect mongodb session
const store = new mongodbStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions",
});

// express session
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store,
  })
);
// Set view engine

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Define routes
const blogRoute = require("./routes/blog.route");
const adminRoute = require("./routes/admin.route");
const authRoute = require("./routes/auth.route");

app.use(blogRoute);
app.use("/admin", adminRoute);
app.use("/auth", authRoute);

//Database Connection

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Data Base Connected.");
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => console.log(err));
