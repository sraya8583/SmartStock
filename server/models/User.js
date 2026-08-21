const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true } // מוסיף אוטומטית createdAt (תאריך הרשמה) ו-updatedAt
);

module.exports = mongoose.model("User", userSchema);
