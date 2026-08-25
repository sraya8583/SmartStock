// בונה את תוכן ה-HTML של מייל התראה על מלאי נמוך למוצר - באותו סגנון כמו resetPasswordEmail.js
function lowStockEmailHtml(product) {
  return `
    <div dir="rtl" style="font-family: Arial, Helvetica, sans-serif; max-width: 420px; margin: 0 auto; padding: 24px; text-align: center; color: #1f2937;">
      <div style="font-size: 1.375rem; font-weight: bold; color: #001f40; margin-bottom: 24px;">SmartStock</div>
      <h2 style="margin: 0 0 12px; font-size: 1.25rem;">התראת מלאי נמוך</h2>
      <p style="margin: 0 0 20px; font-size: 0.95rem; color: #4b5563;">המוצר <strong>${product.name}</strong> (מק"ט ${product.sku}) הגיע למלאי של ${product.currentStock} יחידות, מתחת לסף שהוגדר (${product.lowStockThreshold}).</p>
      <p style="margin: 16px 0 0; font-size: 0.75rem; color: #9ca3af;">מומלץ לבצע חידוש מלאי בהקדם.</p>
    </div>
  `;
}

module.exports = lowStockEmailHtml;
