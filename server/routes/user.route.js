const express = require("express");
const {
  borrowBook,
  returnBook,
  seeInventory,
  getAllBooks,
  penaltyPaid,
} = require("../controllers/user.controller");
const userRouter = express.Router();

userRouter.post("/borrow", borrowBook);
userRouter.post("/return", returnBook);
userRouter.get("/inventory", seeInventory);
userRouter.get("/books", getAllBooks);
userRouter.put("/penalty", penaltyPaid);

module.exports = userRouter;
