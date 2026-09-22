const mongoose = require("mongoose");

const CATEGORIES = [
  "Food",
  "Fashion",
  "Tech",
  "Health",
  "Education",
  "Services",
  "Retail",
  "Other",
];

const businessSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Business name is required"],
      trim: true,
      minlength: [2, "Business name must be at least 2 characters"],
      maxlength: [80, "Business name must be under 80 characters"],
    },
    owner: {
      type: String,
      required: [true, "Owner name is required"],
      trim: true,
      minlength: [2, "Owner name must be at least 2 characters"],
      maxlength: [80, "Owner name must be under 80 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: CATEGORIES,
        message: "Category must be one of: " + CATEGORIES.join(", "),
      },
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      minlength: [2, "City must be at least 2 characters"],
      maxlength: [60, "City must be under 60 characters"],
    },
    tagline: {
      type: String,
      required: [true, "Tagline is required"],
      trim: true,
      maxlength: [140, "Tagline must be under 140 characters"],
    },
    website: {
      type: String,
      trim: true,
      match: [
        /^https?:\/\/.+\..+/i,
        "Website must be a valid URL starting with http:// or https://",
      ],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Email must be a valid email address"],
    },
  },
  { timestamps: true }
);

businessSchema.statics.CATEGORIES = CATEGORIES;

module.exports = mongoose.model("Business", businessSchema);
