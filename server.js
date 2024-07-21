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

//

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById('669c42a1447ac7c6f98652a8')
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

// Define routes
const blogRoute = require("./routes/blog.route");
const authRoute = require("./routes/auth.route");
const { error } = require("console");

app.use("/", blogRoute);
app.use("/auth", authRoute);

//Database Connection

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Data Base Connected.");
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
    return User.findOne().then((user) => {
      if (!user) {
        User.create({
          username: "Zue Pyae",
          email: "zuepyae@gmail.com",
          password: "abcdef",
        });
      }
      return user;
    });
  })
  .then((result) => console.log(result))
  .catch((err) => console.log(err));
