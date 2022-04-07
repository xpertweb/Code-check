const express = require("express");
const app = express();
var cors = require("cors");
app.use(cors());
require('dotenv').config()
const CONFIG = require("./config.json");
require("./config/database");


const bodyParser = require("body-parser");
const port = CONFIG.PORT || 5000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/contact", require("./routes/contactRoutes"));
app.use("/user", require("./routes/userRoutes"));
app.use("/tag",require("./routes/tagRouter"))

// error response

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
});

// catch 404 and forward to error handler//
app.use("*", (req, res) => {
  return res.status(404).json({
    success: false,
    message: "API endpoint doesnt exist",
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
