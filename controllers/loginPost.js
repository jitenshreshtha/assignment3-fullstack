const User = require("../models/user");
const express = require("express");
const app = express();
const bcrypt = require('bcrypt');
app.use((req, res, next) => {
    res.locals.user_id = req.session.user_id;
    res.locals.usertype = req.session.usertype;
    res.locals.username = req.session.username;
    next();
  });

module.exports.loginPost = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Set session variables
      req.session.user_id = user._id;
      req.session.usertype = user.usertype;
      req.session.username = user.username;

      res.locals.user_id = user._id;
      res.locals.usertype = user.usertype;
      res.locals.username = user.username;

      res.redirect("/");
    } else {
      res.send("Invalid username or password.");
    }
  } catch (error) {
    res.send("Login error. Please try again.");
  }
};
