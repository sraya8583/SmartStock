import { useState, useEffect, useCallback } from "react";
import { fetchProductMovements } from "../../services/products/movementsApi";

// Hook שאחראי על שליפת היסטוריית תנועות המלאי של מוצר מסוים
// מחזיר: data (מערך התנועות), isLoading, error, refetch
function useMovements(productId) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMovements = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const movements = await fetchProductMovements(productId);
      setData(movements);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    loadMovements();
  }, [loadMovements]);

  return { data, isLoading, error, refetch: loadMovements };
}

export default useMovements;
