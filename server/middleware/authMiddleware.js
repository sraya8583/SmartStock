const jwt = require("jsonwebtoken");

// מוודא שהבקשה מגיעה עם טוקן (JWT) תקין ב-Header לפני שממשיכים לראוט המבוקש
// אם הטוקן חסר/לא תקין - עוצר את הבקשה עם 401 ולא קורא ל-next()
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "יש להתחבר כדי לבצע פעולה זו" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "פג תוקף ההתחברות - יש להתחבר מחדש" });
  }
}

module.exports = authMiddleware;
