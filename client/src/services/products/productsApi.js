import { getAuthHeaders } from "../authHeaders";

const API_URL = "http://localhost:5000/api/products";

// שליפת כל המוצרים מהשרת
export async function fetchProducts() {
  const response = await fetch(API_URL, { headers: getAuthHeaders() });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "שגיאה בשליפת המוצרים מהשרת");
  }

  return response.json();
}

// הוספת מוצר חדש
export async function createProduct(productData) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "שגיאה בהוספת המוצר");
  }

  return response.json();
}

// עדכון מוצר קיים (למשל שינוי שם)
export async function updateProduct(id, updates) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "שגיאה בעדכון המוצר");
  }

  return response.json();
}

// מחיקת מוצר לפי ID
export async function deleteProduct(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "שגיאה במחיקת המוצר");
  }
}

// עדכון מלאי (הכנסה/לקיחה) - מפעיל את recordStockMovement בשרת
export async function recordStockMovement(productId, movementData) {
  const response = await fetch(`${API_URL}/${productId}/movement`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(movementData),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "עדכון המלאי נכשל");
  }

  return response.json();
}
