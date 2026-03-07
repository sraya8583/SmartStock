// סקריפט חד-פעמי להוספת מוצרי בדיקה למסד הנתונים
// הרצה: node seed.js (מתוך תיקיית server)

require("dotenv").config();
const connectDB = require("./config/db");
const Product = require("./models/Product");

const products = [
  { name: "עט כחול", category: "כלי כתיבה", quantity: 20, minThreshold: 5, price: 3.5 },
  { name: "עט אדום", category: "כלי כתיבה", quantity: 15, minThreshold: 5, price: 3.5 },
  { name: "עיפרון HB", category: "כלי כתיבה", quantity: 50, minThreshold: 10, price: 2.0 },
  { name: "מחק לבן", category: "כלי כתיבה", quantity: 30, minThreshold: 10, price: 1.5 },
  { name: "סרגל 30 ס\"מ", category: "כלי כתיבה", quantity: 25, minThreshold: 5, price: 4.0 },
  { name: "מחברת A4", category: "נייר ומחברות", quantity: 40, minThreshold: 10, price: 12.0 },
  { name: "מחברת A5", category: "נייר ומחברות", quantity: 35, minThreshold: 10, price: 8.0 },
  { name: "דף נייר 500 דפים", category: "נייר ומחברות", quantity: 10, minThreshold: 3, price: 35.0 },
  { name: "פנקס ספירלי", category: "נייר ומחברות", quantity: 20, minThreshold: 5, price: 15.0 },
  { name: "דביק צהוב 100 דפים", category: "נייר ומחברות", quantity: 18, minThreshold: 5, price: 9.0 },
  { name: "מספריים קטנות", category: "ציוד משרדי", quantity: 12, minThreshold: 3, price: 18.0 },
  { name: "סיכות נייר 100 יח'", category: "ציוד משרדי", quantity: 60, minThreshold: 10, price: 5.0 },
  { name: "אטבי נייר גדולים", category: "ציוד משרדי", quantity: 45, minThreshold: 10, price: 4.0 },
  { name: "סלוטייפ שקוף", category: "ציוד משרדי", quantity: 22, minThreshold: 5, price: 6.5 },
  { name: "דבק שטיק", category: "ציוד משרדי", quantity: 30, minThreshold: 8, price: 7.0 },
  { name: "תיקיה כחולה", category: "תיוק", quantity: 50, minThreshold: 10, price: 3.0 },
  { name: "תיקיה אדומה", category: "תיוק", quantity: 50, minThreshold: 10, price: 3.0 },
  { name: "קלסר 4 טבעות", category: "תיוק", quantity: 15, minThreshold: 5, price: 22.0 },
  { name: "מפריד 5 חלקים", category: "תיוק", quantity: 20, minThreshold: 5, price: 8.0 },
  { name: "תוויות מדבקות", category: "תיוק", quantity: 25, minThreshold: 5, price: 11.0 },
  { name: "עכבר אלחוטי", category: "אלקטרוניקה", quantity: 8, minThreshold: 2, price: 89.0 },
  { name: "מקלדת USB", category: "אלקטרוניקה", quantity: 6, minThreshold: 2, price: 120.0 },
  { name: "רכזת USB 4 יציאות", category: "אלקטרוניקה", quantity: 10, minThreshold: 2, price: 55.0 },
  { name: "כבל USB-C", category: "אלקטרוניקה", quantity: 20, minThreshold: 5, price: 25.0 },
  { name: "אוזניות קווית", category: "אלקטרוניקה", quantity: 5, minThreshold: 2, price: 65.0 },
  { name: "ספל קרמיקה", category: "מטבח", quantity: 14, minThreshold: 3, price: 28.0 },
  { name: "כפית פלסטיק 50 יח'", category: "מטבח", quantity: 10, minThreshold: 2, price: 12.0 },
  { name: "קפה נמס 200 גר'", category: "מטבח", quantity: 7, minThreshold: 2, price: 42.0 },
  { name: "סוכר 1 ק\"ג", category: "מטבח", quantity: 5, minThreshold: 2, price: 9.0 },
  { name: "מגבות נייר גליל", category: "מטבח", quantity: 12, minThreshold: 3, price: 14.0 },
];

const run = async () => {
  await connectDB();

  // הוספת כל המוצרים
  const inserted = await Product.insertMany(products);
  console.log(`נוספו ${inserted.length} מוצרים בהצלחה`);
  process.exit(0);
};

run();
