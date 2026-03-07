import { useState, useEffect, useCallback } from "react";

const API_URL = "http://localhost:5000/api/products";

// Hook שאחראי על שליפת כל המוצרים מהשרת
// מחזיר: data (מערך המוצרים), isLoading (האם טוען), error (הודעת שגיאה), refetch (פונקציה לרענון)
function useProducts() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // useCallback מונע יצירה מחדש של הפונקציה בכל רנדר
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("שגיאה בשליפת המוצרים מהשרת");
      }

      const products = await response.json();
      setData(products);
    } catch (err) {
      setError(err.message);
    } finally {
      // בסוף — בין אם הצליח ובין אם נכשל — מכבים את הloading
      setIsLoading(false);
    }
  }, []);

  // שליפה ראשונית כשה-component עולה
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { data, isLoading, error, refetch: fetchProducts };
}

export default useProducts;
