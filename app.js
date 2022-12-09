const express = require("express");
const morgan = require("morgan");

const tourRouter = require("./routes/tourRoutes.js")
const petRouter = require("./routes/petRoutes.js")

const app = express();

// Middleware for POST methods to work
app.use(morgan("dev"));
app.use(express.json());
// app.use(express.static(`${__dirname}/whatever the folder's name is where the static files are`))

// This middleware applies to all requests
app.use((req, res, next) => {
  console.log("MIDDLEWARE!x");

  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

// Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/pets', petRouter);

module.exports = app;