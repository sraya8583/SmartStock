const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");

const SALT_ROUNDS = 10;
const RESET_TOKEN_EXPIRES_MS = 60 * 60 * 1000; // שעה

// שולחת מייל דרך Brevo API (בקשת HTTP ישירה, בלי SDK נוסף)
async function sendResetEmail(email, resetLink) {
  await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { email: process.env.SENDER_EMAIL },
      to: [{ email }],
      subject: "איפוס סיסמה - SmartStock",
      htmlContent: `<p>לאיפוס הסיסמה יש ללחוץ על הקישור הבא:</p><p><a href="${resetLink}">${resetLink}</a></p><p>הקישור תקף לשעה אחת.</p>`,
    }),
  });
}

// מייצרת טוקן (JWT) עבור משתמש - משמש גם ברישום וגם בהתחברות
function generateToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "30d",
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

    const role = "user";

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await User.create({ email, password: hashedPassword, role, username: req.body.username });

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

    res.status(200).json({ email: user.email, createdAt: user.createdAt, username: user.username, role: user.role });
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

// שכחתי סיסמה - מייצרת טוקן זמני ושולחת מייל עם לינק לאיפוס
// מחזירים הודעת הצלחה גם אם המייל לא נמצא, כדי לא לחשוף אילו מיילים רשומים במערכת
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + RESET_TOKEN_EXPIRES_MS;
      await user.save();

      const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
      const resetLink = `${clientUrl}/reset-password/${resetToken}`;
      await sendResetEmail(user.email, resetLink);
    }

    res.status(200).json({ message: "אם קיים משתמש עם אימייל זה, נשלח אליו קישור לאיפוס סיסמה" });
  } catch (error) {
    res.status(500).json({ message: "שליחת קישור לאיפוס נכשלה" });
  }
};

// איפוס סיסמה - מאתרים משתמש לפי הטוקן שבתוקף, מעדכנים סיסמה חדשה ומנקים את הטוקן
// בהצלחה מחזירים טוקן התחברות רגיל, כדי שהמשתמש ייכנס ישר בלי להתחבר שוב
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "יש להזין סיסמה חדשה" });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: "הקישור לאיפוס אינו תקין או שפג תוקפו" });
    }

    user.password = await bcrypt.hash(password, SALT_ROUNDS);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    const authToken = generateToken(user);
    res.status(200).json({ token: authToken });
  } catch (error) {
    res.status(500).json({ message: "איפוס הסיסמה נכשל" });
  }
};

module.exports = {
  register,
  login,
  getMe,
  deleteMe,
  forgotPassword,
  resetPassword,
};
