const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: Number, required: true, enum: [0, 1, 2] },
  },
  { collection: "user-data" }
);

const usermodel = mongoose.model("user-data", User);

module.exports = usermodel;
