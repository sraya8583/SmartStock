// בונה את תוכן ה-HTML של מייל איפוס הסיסמה - הלוגו כטקסט (Gmail לא מציג תמונות מוטמעות כ-base64),
// וקישור האיפוס מוצג ככפתור
function resetPasswordEmailHtml(resetLink) {
  return `
    <div dir="rtl" style="font-family: Arial, Helvetica, sans-serif; max-width: 420px; margin: 0 auto; padding: 24px; text-align: center; color: #1f2937;">
      <div style="font-size: 1.375rem; font-weight: bold; color: #001f40; margin-bottom: 24px;">SmartStock</div>
      <h2 style="margin: 0 0 12px; font-size: 1.25rem;">איפוס סיסמה</h2>
      <p style="margin: 0 0 20px; font-size: 0.95rem; color: #4b5563;">היי, זו הודעה מ-SmartStock. ביקשת לאפס את סיסמתך - לחצו על הכפתור למטה למעבר לאיפוס סיסמה. הקישור תקף לשעה אחת.</p>
      <a href="${resetLink}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 10px 28px; border-radius: 6px; font-weight: bold;">איפוס סיסמה</a>
      <p style="margin: 16px 0 0; font-size: 0.75rem; color: #9ca3af;">אם לא ביקשת, נא התעלם ממייל זה.</p>
    </div>
  `;
}

module.exports = resetPasswordEmailHtml;
