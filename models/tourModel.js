const mongoose = require("mongoose");
const slugify = require("slugify");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name!"],
      unique: true,
      trim: true,
      maxlength: [40, "A tour name must have less or equal than 40 characters"],
      minlength: [10, "A tour name must have more than 10 characters"],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have a duration!"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a maximum group size!"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty!"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either easy, medium, or difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price!"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // -this will point to the current document on NEW document creation
          // -val is the value that the user inputted
          return val <= this.price; // -> this is not going to work on UPDATE
          // 100 < 200 -> true, no error or validation error will be triggered
        },
        message: "Discount price ({VALUE}) should be below the regular price",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a summary!"],
    },
    description: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });

  next();
});

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();

  next();
});

tourSchema.post(/^find/, function (docs, next) {
  // console.log(`Query took: ${Date.now() - this.start} milliseconds`);

  next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre("aggregate", function (next) {
  // removing all documents from the output that have secretTour set to true
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
