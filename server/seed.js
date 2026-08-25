// סקריפט חד-פעמי לאיפוס המלאי: מוחק את כל המוצרים והתנועות הקיימים,
// ומכניס במקומם מוצרי מחסן/מטבח למוסד לימוד עם פנימייה + כמה תנועות מלאי לדוגמה.
// הרצה: node seed.js (מתוך תיקיית server)

require("dotenv").config();
const connectDB = require("./config/db");
const Product = require("./models/Product");
const StockMovement = require("./models/StockMovement");
const User = require("./models/User");

const products = [
  { name: "אורז לבן", sku: "MZ01", category: "מזון יבש", currentStock: 40, lowStockThreshold: 10 },
  { name: "אורז מלא", sku: "MZ02", category: "מזון יבש", currentStock: 15, lowStockThreshold: 8 },
  { name: "פסטה (ספגטי)", sku: "MZ03", category: "מזון יבש", currentStock: 30, lowStockThreshold: 10 },
  { name: "פתיתים", sku: "MZ04", category: "מזון יבש", currentStock: 20, lowStockThreshold: 8 },
  { name: "קמח לבן", sku: "MZ05", category: "מזון יבש", currentStock: 25, lowStockThreshold: 10 },
  { name: "סוכר לבן", sku: "MZ06", category: "מזון יבש", currentStock: 8, lowStockThreshold: 10 },
  { name: "מלח", sku: "MZ07", category: "מזון יבש", currentStock: 18, lowStockThreshold: 5 },
  { name: "שמן קנולה", sku: "MZ08", category: "מזון יבש", currentStock: 24, lowStockThreshold: 8 },
  { name: "שמן זית", sku: "MZ09", category: "מזון יבש", currentStock: 10, lowStockThreshold: 5 },
  { name: "קטשופ", sku: "MZ10", category: "מזון יבש", currentStock: 6, lowStockThreshold: 8 },
  { name: "מיונז", sku: "MZ11", category: "מזון יבש", currentStock: 12, lowStockThreshold: 6 },
  { name: "חרדל", sku: "MZ12", category: "מזון יבש", currentStock: 9, lowStockThreshold: 4 },
  { name: "תבלין פפריקה", sku: "MZ13", category: "מזון יבש", currentStock: 14, lowStockThreshold: 5 },
  { name: "תבלין כמון", sku: "MZ14", category: "מזון יבש", currentStock: 13, lowStockThreshold: 5 },
  { name: "פלפל שחור גרוס", sku: "MZ15", category: "מזון יבש", currentStock: 11, lowStockThreshold: 5 },
  { name: "אבקת מרק עוף", sku: "MZ16", category: "מזון יבש", currentStock: 16, lowStockThreshold: 6 },
  { name: "תה שחור", sku: "MZ17", category: "מזון יבש", currentStock: 20, lowStockThreshold: 8 },
  { name: "קפה נמס", sku: "MZ18", category: "מזון יבש", currentStock: 4, lowStockThreshold: 6 },
  { name: "קקאו לשתייה", sku: "MZ19", category: "מזון יבש", currentStock: 10, lowStockThreshold: 5 },
  { name: "דבש", sku: "MZ20", category: "מזון יבש", currentStock: 7, lowStockThreshold: 4 },
  { name: "חומוס משומר", sku: "SH01", category: "שימורים", currentStock: 22, lowStockThreshold: 10 },
  { name: "טונה משומרת", sku: "SH02", category: "שימורים", currentStock: 18, lowStockThreshold: 10 },
  { name: "תירס משומר", sku: "SH03", category: "שימורים", currentStock: 15, lowStockThreshold: 8 },
  { name: "עדשים", sku: "MZ21", category: "מזון יבש", currentStock: 12, lowStockThreshold: 6 },
  { name: "שעועית לבנה יבשה", sku: "MZ22", category: "מזון יבש", currentStock: 10, lowStockThreshold: 6 },
  { name: "סוכריות/ממתקים", sku: "MZ23", category: "מזון יבש", currentStock: 30, lowStockThreshold: 10 },
  { name: "ביסקוויטים", sku: "MZ24", category: "מזון יבש", currentStock: 25, lowStockThreshold: 10 },
  { name: "קורנפלקס", sku: "MZ25", category: "מזון יבש", currentStock: 14, lowStockThreshold: 8 },
  { name: "שמרים יבשים", sku: "MZ26", category: "מזון יבש", currentStock: 3, lowStockThreshold: 5 },
  { name: "אבקת אפייה", sku: "MZ27", category: "מזון יבש", currentStock: 9, lowStockThreshold: 4 },
  { name: "סבון כלים", sku: "NK01", category: "ניקיון", currentStock: 5, lowStockThreshold: 8 },
  { name: "אקונומיקה", sku: "NK02", category: "ניקיון", currentStock: 10, lowStockThreshold: 6 },
  { name: "נוזל רצפות", sku: "NK03", category: "ניקיון", currentStock: 12, lowStockThreshold: 6 },
  { name: "נייר טואלט", sku: "NK04", category: "ניקיון", currentStock: 10, lowStockThreshold: 15 },
  { name: "מגבות נייר", sku: "NK05", category: "ניקיון", currentStock: 18, lowStockThreshold: 8 },
  { name: "שקיות זבל גדולות", sku: "NK06", category: "ניקיון", currentStock: 25, lowStockThreshold: 10 },
  { name: "סבון ידיים נוזלי", sku: "NK07", category: "ניקיון", currentStock: 4, lowStockThreshold: 6 },
  { name: "ספריי ניקוי כללי", sku: "NK08", category: "ניקיון", currentStock: 9, lowStockThreshold: 5 },
  { name: "מטליות ניקוי", sku: "NK09", category: "ניקיון", currentStock: 20, lowStockThreshold: 10 },
  { name: "כפפות ניקיון חד פעמיות", sku: "NK10", category: "ניקיון", currentStock: 15, lowStockThreshold: 10 },
  { name: "צלחות חד פעמיות", sku: "KL01", category: "כלים חד פעמיים", currentStock: 40, lowStockThreshold: 20 },
  { name: "כוסות חד פעמיות", sku: "KL02", category: "כלים חד פעמיים", currentStock: 45, lowStockThreshold: 20 },
  { name: "סכו\"ם חד פעמי", sku: "KL03", category: "כלים חד פעמיים", currentStock: 50, lowStockThreshold: 20 },
  { name: "ניילון נצמד", sku: "KL04", category: "כלים חד פעמיים", currentStock: 8, lowStockThreshold: 5 },
  { name: "נייר אלומיניום", sku: "KL05", category: "כלים חד פעמיים", currentStock: 7, lowStockThreshold: 5 },
  { name: "שקיות אחסון (זיפלוק)", sku: "KL06", category: "כלים חד פעמיים", currentStock: 12, lowStockThreshold: 6 },
  { name: "נורות לד", sku: "TH01", category: "תחזוקה", currentStock: 3, lowStockThreshold: 5 },
  { name: "סוללות AA", sku: "TH02", category: "תחזוקה", currentStock: 10, lowStockThreshold: 12 },
  { name: "סוללות AAA", sku: "TH03", category: "תחזוקה", currentStock: 14, lowStockThreshold: 10 },
  { name: "מגבונים לחים", sku: "NK11", category: "ניקיון", currentStock: 4, lowStockThreshold: 6 },
];

// תנועות מלאי לדוגמה: sku, סוג, כמות מסומנת (שלילי = יציאה), הערה
const movementSeeds = [
  { sku: "MZ10", type: "sale", quantity: -4, note: "חלוקה למטבח" },
  { sku: "MZ06", type: "sale", quantity: -12, note: "חלוקה למטבח" },
  { sku: "MZ18", type: "sale", quantity: -6, note: "חלוקה למטבח" },
  { sku: "NK04", type: "sale", quantity: -10, note: "חלוקה לחדרי הפנימייה" },
  { sku: "NK07", type: "sale", quantity: -5, note: "חלוקה לחדרי הפנימייה" },
  { sku: "TH01", type: "sale", quantity: -7, note: "החלפת נורות בחדרים" },
  { sku: "MZ01", type: "restock", quantity: 20, note: "אספקה שבועית מהספק" },
  { sku: "KL03", type: "restock", quantity: 50, note: "אספקה שבועית מהספק" },
  { sku: "MZ09", type: "return", quantity: 2, note: "בקבוק סגור הוחזר מהמטבח" },
  { sku: "MZ24", type: "adjustment", quantity: -2, note: "התאמה אחרי ספירת מלאי" },
];

const run = async () => {
  await connectDB();

  const admin = await User.findOne({ role: "admin" });
  if (!admin) {
    throw new Error("לא נמצא משתמש admin - נדרש לצורך performedBy בתנועות המלאי");
  }

  await StockMovement.deleteMany({});
  await Product.deleteMany({});
  console.log("נמחקו כל המוצרים והתנועות הקיימים");

  const inserted = await Product.insertMany(products);
  console.log(`נוספו ${inserted.length} מוצרים בהצלחה`);

  const productBySku = Object.fromEntries(inserted.map((p) => [p.sku, p]));

  const movements = movementSeeds.map((m) => {
    const product = productBySku[m.sku];
    return {
      productId: product._id,
      performedBy: admin._id,
      type: m.type,
      quantity: m.quantity,
      resultingBalance: product.currentStock,
      note: m.note,
    };
  });

  const insertedMovements = await StockMovement.insertMany(movements);
  console.log(`נוספו ${insertedMovements.length} תנועות מלאי בהצלחה`);

  process.exit(0);
};

run();
