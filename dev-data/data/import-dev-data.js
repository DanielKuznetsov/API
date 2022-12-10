const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("./../../models/tourModel.js");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.set("strictQuery", true);

// Connects to a database
mongoose.connect(DB, {}).then((con) => {
  console.log("Connected to MongoDB!");
});

// READ JSON DATA
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, "utf-8"));

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("Data imported successfully!");

    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("Data deleted successfully!");
    
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if(process.argv[2] === "--import") {
    importData();
}

if(process.argv[2] === "--delete") {
    deleteData();
}

//node dev-data/data/import-dev-data.js --import