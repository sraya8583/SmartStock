const express = require("express");
const { register, login, getMe, deleteMe } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/auth/register", register);
router.post("/auth/login", login);

// ראוטים מוגנים - דורשים טוקן תקין (מזהים את המשתמש דרך req.user.id)
router.get("/auth/me", authMiddleware, getMe);
router.delete("/auth/me", authMiddleware, deleteMe);

module.exports = router;
