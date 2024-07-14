const express = require("express");
const {
  addBook,
  removeBook,
  updateQuantity,
  borrowedList,
} = require("../controllers/librarian.controller");
const librarianRouter = express.Router();

librarianRouter.post("/addBook", addBook);
librarianRouter.delete("/deleteBook", removeBook);
librarianRouter.put("/book/updateQuantity", updateQuantity);
librarianRouter.get("/books/borrowed", borrowedList);

module.exports = librarianRouter;
