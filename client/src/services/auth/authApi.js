import { getAuthHeaders } from "../authHeaders";

const API_URL = "http://localhost:5000/auth";

// רישום משתמש חדש
export async function registerUser(credentials) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "ההרשמה נכשלה");
  }

  return response.json();
}

// התחברות - מחזיר טוקן (JWT) בהצלחה
export async function loginUser(credentials) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "ההתחברות נכשלה");
  }

  return response.json();
}

// שכחתי סיסמה - שולח בקשה לאיפוס סיסמה, בהצלחה נשלח מייל עם קישור לאיפוס
export async function forgotPassword(email) {
  const response = await fetch(`${API_URL}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "שליחת קישור לאיפוס נכשלה");
  }

  return response.json();
}

// איפוס סיסמה לפי טוקן זמני שהתקבל בקישור מהמייל - מחזיר טוקן (JWT) בהצלחה
export async function resetPassword({ token, password }) {
  const response = await fetch(`${API_URL}/reset-password/${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "איפוס הסיסמה נכשל");
  }

  return response.json();
}

// שליפת פרטי המשתמש המחובר (מייל + תאריך הרשמה + שם משתמש)
export async function fetchProfile() {
  const response = await fetch(`${API_URL}/me`, { headers: getAuthHeaders() });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "שליפת פרטי המשתמש נכשלה");
  }
  return response.json();
}

// מחיקת המשתמש המחובר
export async function deleteAccount() {
  const response = await fetch(`${API_URL}/me`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "מחיקת המשתמש נכשלה");
  }

  return response.json();
}
