import { useState, useEffect, useCallback } from "react";
import { fetchAllMovements } from "../../services/products/movementsApi";

// Hook שאחראי על שליפת היסטוריית תנועות המלאי של כל המוצרים יחד
// מחזיר: data (מערך התנועות), isLoading, error, refetch
function useAllMovements() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMovements = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const movements = await fetchAllMovements();
      setData(movements);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMovements();
  }, [loadMovements]);

  return { data, isLoading, error, refetch: loadMovements };
}

export default useAllMovements;
