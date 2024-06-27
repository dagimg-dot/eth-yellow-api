// Packages
const express = require("express");
const body_parser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
const { signup, login, updatePassword } = require("../controllers");

// Middlewares

const actionAuth = require("../middlewares/actionAuth");
const authenticateToken = require("../middlewares/jwt");

const app = express();

const port = process.env.EXPRESS_PORT || 3000;

app.use(body_parser.json({ limit: "10mb" }));

// Routes

app.post("/signup", actionAuth, signup);
app.post("/login", actionAuth, login);
app.post("/update-password", actionAuth, authenticateToken, updatePassword);

app.listen(port, () => {
  console.log(`Express server listening on ${port}`);
});
