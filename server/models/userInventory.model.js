const mongoose = require("mongoose");

const UserInventory = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    bookISBN: { type: Number, require: true },
    borrowDate: { type: Date, require: true },
    dueDate: { type: Date, require: true },
    status: { type: String, required: true, enum: ["Borrowed", "Returned"] },
    returnDate: { type: Date },
  },
  { collection: "user-inventory-data" }
);

const userinventorymodel = mongoose.model("user-inventory-data", UserInventory);

module.exports = userinventorymodel;
