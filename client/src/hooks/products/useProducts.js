import { useState, useEffect, useCallback } from "react";
import { fetchProducts } from "../../services/products/productsApi";

// Hook שאחראי על שליפת כל המוצרים מהשרת
// מחזיר: data (מערך המוצרים), isLoading (האם טוען), error (הודעת שגיאה), refetch (פונקציה לרענון)
function useProducts() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // useCallback מונע יצירה מחדש של הפונקציה בכל רנדר
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const products = await fetchProducts();
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
    loadProducts();
  }, [loadProducts]);

  return { data, isLoading, error, refetch: loadProducts };
}

export default useProducts;
