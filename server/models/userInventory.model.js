const mongoose = require("mongoose");

const UserInventory = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    bookISBN: { type: Number, require: true },
    borrowDate: { type: Date, require: true },
    dueDate: { type: Date, require: true },
    status: { type: String, required: true, enum: ["Borrowed", "Returned"] },
    isPenalty: { type: Boolean, default: false },
    lateReturnPenalty: { type: Number, default: 0 },
    isPaid: { type: Boolean, default: false },
    returnDate: { type: Date },
  },
  { collection: "user-inventory-data" }
);

const userinventorymodel = mongoose.model("user-inventory-data", UserInventory);

module.exports = userinventorymodel;
