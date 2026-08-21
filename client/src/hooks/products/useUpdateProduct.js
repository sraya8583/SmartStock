import { useState } from "react";
import { updateProduct } from "../../services/products/productsApi";

// Hook שאחראי על עדכון מוצר קיים (למשל שינוי שם)
// מחזיר: editProduct (פונקציה לביצוע הבקשה, מחזירה true/false להצלחה), isLoading, error
function useUpdateProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const editProduct = async (id, updates) => {
    setIsLoading(true);
    setError(null);

    try {
      await updateProduct(id, updates);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { editProduct, isLoading, error };
}

export default useUpdateProduct;
