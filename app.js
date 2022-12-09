const fs = require("fs");
const express = require("express");

const app = express();

// Middleware for POST methods to work
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get("/api/v1/tours", (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours: tours,
    },
  });
});

app.post("/api/v1/tours", (req, res) => {
  const newId = tours[tours.length - 1].id + 1;

  // Merges two objects together
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  // Write into a file
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).jsonp({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );
});

const port = 4000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
