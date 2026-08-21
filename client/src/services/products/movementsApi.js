import { getAuthHeaders } from "../authHeaders";

const PRODUCTS_URL = "http://localhost:5000/api/products";
const MOVEMENTS_URL = "http://localhost:5000/api/movements";

// שליפת היסטוריית תנועות מלאי של מוצר מסוים
export async function fetchProductMovements(productId) {
  const response = await fetch(`${PRODUCTS_URL}/${productId}/movements`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("שגיאה בשליפת היסטוריית המלאי");
  }

  return response.json();
}

// שליפת היסטוריית תנועות מלאי של כל המוצרים יחד
export async function fetchAllMovements() {
  const response = await fetch(MOVEMENTS_URL, { headers: getAuthHeaders() });

  if (!response.ok) {
    throw new Error("שגיאה בשליפת היסטוריית המלאי");
  }

  return response.json();
}
