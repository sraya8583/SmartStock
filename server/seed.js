// סקריפט חד-פעמי להוספת מוצרי בדיקה למסד הנתונים
// הרצה: node seed.js (מתוך תיקיית server)

require("dotenv").config();
const connectDB = require("./config/db");
const Product = require("./models/Product");

const products = [
  { name: "עט כחול", sku: "PEN-BLU-001", category: "כלי כתיבה", currentStock: 20, lowStockThreshold: 5, price: 3.5 },
  { name: "עיפרון HB", sku: "PEN-HB-002", category: "כלי כתיבה", currentStock: 50, lowStockThreshold: 10, price: 2.0 },
  { name: "מחברת A4", sku: "NB-A4-003", category: "נייר ומחברות", currentStock: 40, lowStockThreshold: 10, price: 12.0 },
  { name: "דף נייר 500 דפים", sku: "PPR-500-004", category: "נייר ומחברות", currentStock: 2, lowStockThreshold: 3, price: 35.0 },
  { name: "מספריים קטנות", sku: "OFC-SCS-005", category: "ציוד משרדי", currentStock: 12, lowStockThreshold: 3, price: 18.0 },
  { name: "סלוטייפ שקוף", sku: "OFC-TP-006", category: "ציוד משרדי", currentStock: 4, lowStockThreshold: 5, price: 6.5 },
  { name: "קלסר 4 טבעות", sku: "FIL-BND-007", category: "תיוק", currentStock: 15, lowStockThreshold: 5, price: 22.0 },
  { name: "עכבר אלחוטי", sku: "ELC-MOU-008", category: "אלקטרוניקה", currentStock: 1, lowStockThreshold: 2, price: 89.0 },
  { name: "כבל USB-C", sku: "ELC-USB-009", category: "אלקטרוניקה", currentStock: 20, lowStockThreshold: 5, price: 25.0 },
  { name: "קפה נמס 200 גר'", sku: "KIT-COF-010", category: "מטבח", currentStock: 1, lowStockThreshold: 2, price: 42.0 },
];

const run = async () => {
  await connectDB();

  // הוספת כל המוצרים
  const inserted = await Product.insertMany(products);
  console.log(`נוספו ${inserted.length} מוצרים בהצלחה`);
  process.exit(0);
};

run();
