const express = require("express");
const app = express();

var path = require("path");

const mongoose = require("mongoose");

const dotenv = require("dotenv").config({
  path: require("find-config")(".env"),
});

const authRoute = require("./routes/auth");

app.use(express.static(path.join(__dirname, "public")));

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB connection successful!"))
  .catch((err) => {
    console.log(err);
  });

app.use(cors());
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoute);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("Backend server is running on port" + port);
});
