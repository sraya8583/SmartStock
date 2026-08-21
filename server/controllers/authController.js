const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const SALT_ROUNDS = 10;

// מייצרת טוקן (JWT) עבור משתמש - משמש גם ברישום וגם בהתחברות
function generateToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

// רישום משתמש חדש - מצפין (hash) את הסיסמה לפני שמירה ב-DB, לא שומרים סיסמה גלויה
// בהצלחה מחזירים גם טוקן, כדי שהמשתמש ייכנס ישר לדף הבית בלי להתחבר שוב
const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "יש להזין אימייל וסיסמה" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "משתמש עם אימייל זה כבר קיים" });
    }

    // המשתמש i0548542122@gmail.com הוא בעל הפרויקט - נרשם כ-admin, כל השאר כ-user רגיל
    const role = email === "i0548542122@gmail.com" ? "admin" : "user";

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await User.create({ email, password: hashedPassword, role });

    const token = generateToken(newUser);
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: "ההרשמה נכשלה" });
  }
};

// כניסה למערכת - משווים את הסיסמה שהוזנה מול ה-hash השמור (bcrypt.compare),
// ובהצלחה מחזירים טוקן (JWT) שהקליינט ישתמש בו בבקשות הבאות
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "אימייל או סיסמה שגויים" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "אימייל או סיסמה שגויים" });
    }

    const token = generateToken(user);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "ההתחברות נכשלה" });
  }
};

// מחזירה את פרטי המשתמש המחובר (מייל + תאריך הרשמה) - מזוהה לפי req.user.id שהגיע מהטוקן
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "משתמש לא נמצא" });
    }

    res.status(200).json({ email: user.email, createdAt: user.createdAt });
  } catch (error) {
    res.status(500).json({ message: "שליפת פרטי המשתמש נכשלה" });
  }
};

// מוחקת את המשתמש המחובר - מזוהה לפי req.user.id שהגיע מהטוקן
const deleteMe = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "משתמש לא נמצא" });
    }

    res.status(200).json({ message: "המשתמש נמחק בהצלחה" });
  } catch (error) {
    res.status(500).json({ message: "מחיקת המשתמש נכשלה" });
  }
};

module.exports = {
  register,
  login,
  getMe,
  deleteMe,
};
