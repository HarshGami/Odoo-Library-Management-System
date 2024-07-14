const mongoose = require("mongoose");

const Book = new mongoose.Schema(
  {
    ISBN: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    publisher: { type: String },
    year: { type: Number, required: true },
    genre: { type: String },
    imageLink: { type: String },
    quantity: { type: Number, required: true },
  },
  { collection: "book-data" }
);

const bookmodel = mongoose.model("book-data", Book);

module.exports = bookmodel;
