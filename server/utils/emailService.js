// שולחת מייל דרך Brevo API (בקשת HTTP ישירה, בלי SDK נוסף)
// to יכול להיות כתובת בודדת או מערך כתובות (שליחה לכמה נמענים בבקשה אחת)
async function sendEmail(to, subject, htmlContent) {
  const recipients = Array.isArray(to) ? to : [to];

  await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { email: process.env.SENDER_EMAIL, name: process.env.SENDER_NAME,},
      to: recipients.map((email) => ({ email })),
      subject,
      htmlContent,
    }),
  });
}

module.exports = sendEmail;
