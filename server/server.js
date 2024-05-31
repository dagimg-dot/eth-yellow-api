// Packages
const express = require("express");
const body_parser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
const { signup } = require("../controllers");

// Middlewares

const actionAuth = require("../middlewares/actionAuth");
// const jwt = require("../middlewares/jwt");

const app = express();

const port = process.env.EXPRESS_PORT || 3000;

app.use(body_parser.json({ limit: "10mb" }));

// Routes

app.post("/signup", actionAuth, signup);

app.listen(port, () => {
  console.log(`Express server listening on ${port}`);
});
