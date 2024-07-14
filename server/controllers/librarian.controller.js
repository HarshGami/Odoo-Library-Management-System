const usermodel = require("../models/user.model");
const bookmodel = require("../models/book.model");
const userinventorymodel = require("../models/userInventory.model");
const dotenv = require("dotenv");
const validator = require("validator");
dotenv.config();
const axios = require("axios");

exports.addBook = async (req, res) => {
  try {
    const { ISBN, quantity } = req.body;

    if (!Number.isInteger(parseInt(ISBN))) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid ISBN format" });
    }

    if (!Number.isInteger(parseInt(quantity)) || quantity <= 0) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid quantity format" });
    }

    const existingBook = await bookmodel.findOne({ ISBN: ISBN });
    if (existingBook) {
      return res.status(400).json({
        status: "error",
        message: "Book with this ISBN already exists",
      });
    }

    const googleBooksAPI = `https://www.googleapis.com/books/v1/volumes?q=isbn:${ISBN}`;
    const response = await axios.get(googleBooksAPI);

    if (!response.data.items || response.data.items.length === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "Book not found in Google Books" });
    }

    const bookInfo = response.data.items[0].volumeInfo;

    const newBook = new bookmodel({
      ISBN: ISBN,
      title: bookInfo.title,
      author: bookInfo.authors ? bookInfo.authors.join(", ") : "Unknown",
      publisher: bookInfo.publisher || "Unknown",
      year: bookInfo.publishedDate
        ? new Date(bookInfo.publishedDate).getFullYear()
        : null,
      imageLink: bookInfo.imageLinks.thumbnail,
      genre: bookInfo.categories ? bookInfo.categories.join(", ") : "Unknown",
      quantity: quantity,
    });

    const savedBook = await newBook.save();

    res.status(201).json({
      status: "ok",
      message: "Book added successfully",
      book: savedBook,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.removeBook = async (req, res) => {
  try {
    const { ISBN } = req.query;

    if (!Number.isInteger(parseInt(ISBN))) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid ISBN format" });
    }

    const book = await bookmodel.findOne({ ISBN: ISBN });

    if (!book) {
      return res
        .status(404)
        .json({ status: "error", message: "Book not found" });
    }

    await bookmodel.deleteOne({ ISBN: ISBN });

    res.status(200).json({
      status: "ok",
      message: "Book removed successfully",
      removedBook: book,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.updateQuantity = async (req, res) => {
  try {
    const { ISBN, quantity } = req.body;

    if (!Number.isInteger(parseInt(ISBN))) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid ISBN format" });
    }

    if (!Number.isInteger(parseInt(quantity)) || quantity < 0) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid quantity format" });
    }

    const book = await bookmodel.findOne({ ISBN: ISBN });

    if (!book) {
      return res
        .status(404)
        .json({ status: "error", message: "Book not found" });
    }

    book.quantity = quantity;
    await book.save();

    res.status(200).json({
      status: "ok",
      message: "Book quantity updated successfully",
      updatedBook: book,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.borrowedList = async (req, res) => {
  try {
    const borrowedRecords = await userinventorymodel.find({
      status: "Borrowed",
    });

    if (borrowedRecords.length === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "No borrowed books found" });
    }

    res.status(200).json({
      status: "ok",
      borrowedBooks: borrowedRecords,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
