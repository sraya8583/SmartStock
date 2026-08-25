const User = require("../models/User");

// מוודא שהמשתמש המחובר הוא admin - בדיקה טרייה מה-DB (לא סומך על מה שהיה בטוקן)
// חייב לרוץ אחרי authMiddleware, כי הוא מסתמך על req.user.id
async function requireAdmin(req, res, next) {
  try {
    const user = await User.findById(req.user.id);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "פעולה זו מותרת למנהלים בלבד" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "כישלון באימות הרשאות" });
  }
}

module.exports = requireAdmin;
