// מחזיר את ה-Header עם הטוקן (JWT) שנשמר ב-localStorage אחרי התחברות
// משמש את כל הקריאות ל-API שדורשות התחברות (למשל מוצרים)
export function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}
