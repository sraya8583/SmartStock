const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    username: { type: String },
    resetPasswordToken: { type: String }, // טוקן זמני לאיפוס סיסמה
    resetPasswordExpires: { type: Date }, // מועד תפוגה של הטוקן
  },
  { timestamps: true } // מוסיף אוטומטית createdAt (תאריך הרשמה) ו-updatedAt
);

module.exports = mongoose.model("User", userSchema);
