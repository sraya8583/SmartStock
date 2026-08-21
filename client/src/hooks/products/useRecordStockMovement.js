import { useState } from "react";
import { recordStockMovement } from "../../services/products/productsApi";

// Hook שאחראי על עדכון מלאי (הכנסה/לקיחה) עבור מוצר קיים
// מחזיר: recordMovement (פונקציה לביצוע הבקשה, מחזירה true/false להצלחה), isLoading, error
function useRecordStockMovement() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const recordMovement = async (productId, movementData) => {
    setIsLoading(true);
    setError(null);

    try {
      await recordStockMovement(productId, movementData);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { recordMovement, isLoading, error };
}

export default useRecordStockMovement;
