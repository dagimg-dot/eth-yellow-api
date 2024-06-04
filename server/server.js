// Packages
const express = require("express");
const body_parser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
const { signup, login } = require("../controllers");

// Middlewares

const actionAuth = require("../middlewares/actionAuth");

const app = express();

const port = process.env.EXPRESS_PORT || 3000;

app.use(body_parser.json({ limit: "10mb" }));

// Routes

app.post("/signup", actionAuth, signup);
app.post("/login", actionAuth, login);

app.listen(port, () => {
  console.log(`Express server listening on ${port}`);
});
