const express = require("express");
const ejs = require("ejs");
const path = require("path");
require("dotenv").config();
const mongoose = require("mongoose");
const session = require('express-session');

// controllers
const { homeController } = require("./controllers/home.js");
const { gController } = require("./controllers/g.js");
const { g2Controller } = require("./controllers/g2.js");
const { loginController } = require("./controllers/login.js");
const { g2Post } = require("./controllers/g2Post.js");
const { gupdate } = require("./controllers/gUpdate.js");
const { signup } = require("./controllers/signup.js");
const { loginPost } = require("./controllers/loginPost.js");
const { logout } = require('./controllers/logout.js');
const { examiner } = require('./controllers/examiner.js');
const { appointmentController, createAppointment } = require('./controllers/appointment.js');
const { authenticateDriver, authenticateAdmin } = require('./middleware/authMiddleware.js');
const { authenticateExaminer } = require('./middleware/authenticateExaminer.js');

const app = express();

// importing port number and database url from dotenv file
const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// middleware for parsing JSON and form data
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "yourSecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use((req, res, next) => {
  res.locals.user_id = req.session.user_id;
  res.locals.usertype = req.session.usertype;
  res.locals.username = req.session.username;
  next();
});

// connecting to database
mongoose
  .connect(DATABASE_URL)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.log("Connection error:", err);
  });

app.get("/login", loginController);
app.get("/g2", authenticateDriver, g2Controller);
app.get("/g", authenticateDriver, gController);
app.get("/", homeController);
app.get("/appointment", authenticateAdmin, appointmentController);
app.post("/appointment/create", authenticateAdmin, createAppointment);
app.post("/g2Post", authenticateDriver, g2Post);
app.post("/g/update/:license", authenticateDriver, gupdate);
app.post("/signup", signup);
app.post("/loginPost", loginPost);
app.get('/logout', logout);
app.get('/examiner',authenticateExaminer, examiner);
app.get("*", (req, res) => {
  res.send("Page is not found");
});

app.listen(PORT, () => {
  console.log(`Server created at ${PORT}`);
});
