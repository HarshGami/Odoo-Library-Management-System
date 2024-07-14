const usermodel = require("../models/user.model");
const bookmodel = require("../models/book.model");
const userinventorymodel = require("../models/userInventory.model");
const dotenv = require("dotenv");
const validator = require("validator");
dotenv.config();

exports.borrowBook = async (req, res) => {
  try {
    const { userEmail, bookISBN, borrowDate } = req.body;

    if (!validator.isEmail(userEmail)) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid email format" });
    }

    if (!Number.isInteger(parseInt(bookISBN))) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid ISBN format" });
    }

    const user = await usermodel.findOne({ email: userEmail });
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    const existingBorrowRecord = await userinventorymodel.findOne({
      userEmail,
      bookISBN,
      status: "Borrowed",
    });

    if (existingBorrowRecord) {
      return res.status(400).json({
        status: "error",
        message: "User already has this book borrowed",
      });
    }

    const book = await bookmodel.findOne({ ISBN: bookISBN });
    if (!book) {
      return res
        .status(404)
        .json({ status: "error", message: "Book not found" });
    }

    if (book.quantity <= 0) {
      return res
        .status(400)
        .json({ status: "error", message: "Book is not available" });
    }

    const borrowDateObj = new Date(borrowDate);
    const dueDateObj = new Date(borrowDateObj);
    dueDateObj.setMonth(borrowDateObj.getMonth() + 1);

    book.quantity -= 1;
    await book.save();

    const newBorrowRecord = await userinventorymodel.create({
      userEmail,
      bookISBN,
      borrowDate: borrowDateObj,
      dueDate: dueDateObj,
      status: "Borrowed",
    });

    res.status(200).json({
      status: "ok",
      message: "Book borrowed successfully",
      borrowRecord: newBorrowRecord,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.returnBook = async (req, res) => {
  try {
    const { userEmail, bookISBN } = req.body;

    if (!validator.isEmail(userEmail)) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid email format" });
    }

    if (!Number.isInteger(parseInt(bookISBN))) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid ISBN format" });
    }

    const user = await usermodel.findOne({ email: userEmail });
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    const book = await bookmodel.findOne({ ISBN: bookISBN });
    if (!book) {
      return res
        .status(404)
        .json({ status: "error", message: "Book not found" });
    }

    const borrowRecord = await userinventorymodel.findOne({
      userEmail,
      bookISBN,
      status: "Borrowed",
    });
    if (!borrowRecord) {
      return res
        .status(404)
        .json({ status: "error", message: "Borrow record not found" });
    }

    if (borrowRecord.isPanalty) {
      return res.status(400).json({
        status: "error",
        message: "Please pay the penalty fees before returning the book.",
      });
    }

    borrowRecord.status = "Returned";
    borrowRecord.returnDate = new Date();
    await borrowRecord.save();

    book.quantity += 1;
    await book.save();

    res.status(200).json({
      status: "ok",
      message: "Book returned successfully",
      returnRecord: borrowRecord,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.seeInventory = async (req, res) => {
  try {
    const { userEmail } = req.query;

    const user = await usermodel.findOne({ email: userEmail });
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    let inventoryRecords = await userinventorymodel.find({ userEmail });

    if (inventoryRecords.length === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "No books borrowed by the user" });
    }

    const currentDate = new Date();
    for (let i = 0; i < inventoryRecords.length; i++) {
      if (
        inventoryRecords[i].status === "Borrowed" &&
        inventoryRecords[i].dueDate < currentDate
      ) {
        const daysOverdue = Math.ceil(
          (currentDate - inventoryRecords[i].dueDate) / (1000 * 60 * 60 * 24)
        );
        const penaltyAmount = daysOverdue * 50;

        inventoryRecords[i].lateReturnPenalty = penaltyAmount;
        inventoryRecords[i].isPaid = false;
        inventoryRecords[i].isPenalty = true;

        await inventoryRecords[i].save();
      }
    }

    inventoryRecords = await userinventorymodel.find({ userEmail });

    res.status(200).json({
      status: "ok",
      inventory: inventoryRecords,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    const books = await bookmodel.find();

    res.status(200).json({
      status: "success",
      books: books,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.penaltyPaid = async (req, res) => {
  try {
    const { userEmail, bookISBN } = req.query;

    const inventoryRecord = await userinventorymodel.findOne({
      userEmail: userEmail,
      bookISBN: parseInt(bookISBN),
      status: "Borrowed",
    });

    if (!inventoryRecord) {
      return res.status(404).json({
        status: "error",
        message: "Inventory record not found",
      });
    }

    inventoryRecord.isPaid = true;

    await inventoryRecord.save();

    res.status(200).json({
      status: "success",
      message: "Penalty paid successfully",
      inventoryRecord: inventoryRecord,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
